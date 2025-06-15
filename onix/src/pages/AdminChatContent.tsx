import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminChatContent.css';

interface GuideStep { 
  text: string; 
  imageUrl?: string;
}

interface Guide { 
  steps: GuideStep[]; 
  followUp: string; 
}

interface KeywordGroup { 
  name: string; 
  keywords: string[]; 
  guide: Guide; 
}

interface ChatContent { 
  initialMessage: string;
  keywordGroups: KeywordGroup[];
  responses: Record<string, any>;
  ticketForm: Record<string, any>;
  buttons: Record<string, any>;
}

const AdminChatContent: React.FC = () => {
  const [content, setContent] = useState<ChatContent>({
    initialMessage: '',
    keywordGroups: [],
    responses: {},
    ticketForm: {},
    buttons: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<KeywordGroup | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content`);
        setContent(response.data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/content`, {
        initialMessage: content.initialMessage,
        keywordGroups: content.keywordGroups,
        responses: content.responses,
        ticketForm: content.ticketForm,
        buttons: content.buttons
      });
      alert('Изменения успешно сохранены!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleAddKeywordGroup = () => {
    if (!content) return;
    
    const newGroup: KeywordGroup = {
      name: `Новая группа ${content.keywordGroups.length + 1}`,
      keywords: [],
      guide: {
        steps: [],
        followUp: 'Помогло ли это решить вашу проблему?'
      }
    };
    
    setContent({
      ...content,
      keywordGroups: [...content.keywordGroups, newGroup]
    });
  };

  const handleEditGroup = (group: KeywordGroup) => {
    setEditingGroup(JSON.parse(JSON.stringify(group)));
  };

  const handleUpdateGroup = async (updatedGroup: KeywordGroup) => {
    if (!content || !editingGroup) return;

    // Delete old images that were removed
    for (const oldStep of editingGroup.guide.steps) {
      if (oldStep.imageUrl) {
        const stillExists = updatedGroup.guide.steps.some(
          step => step.imageUrl === oldStep.imageUrl
        );
        if (!stillExists) {
          try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/content/delete-image`, {
              data: { imageUrl: oldStep.imageUrl }
            });
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
      }
    }
    
    setContent({
      ...content,
      keywordGroups: content.keywordGroups.map(group => 
        group.name === editingGroup.name ? updatedGroup : group
      )
    });
    setEditingGroup(null);
  };

  const handleDeleteGroup = async (groupToDelete: KeywordGroup) => {
    if (!content) return;
    
    if (window.confirm(`Удалить группу "${groupToDelete.name}"?`)) {
      // Delete all images from steps
      for (const step of groupToDelete.guide.steps) {
        if (step.imageUrl) {
          try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/content/delete-image`, {
              data: { imageUrl: step.imageUrl }
            });
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }
      
      setContent({
        ...content,
        keywordGroups: content.keywordGroups.filter(group => group.name !== groupToDelete.name)
      });
    }
  };

  const handleAddKeyword = () => {
    if (!editingGroup || !newKeyword.trim()) return;
    
    const updatedGroup = {
      ...editingGroup,
      keywords: [...editingGroup.keywords, newKeyword.trim()]
    };
    setEditingGroup(updatedGroup);
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (!editingGroup) return;
    
    const updatedGroup = {
      ...editingGroup,
      keywords: editingGroup.keywords.filter(k => k !== keyword)
    };
    setEditingGroup(updatedGroup);
  };

  const handleAddStep = () => {
    if (!editingGroup || !newStep.trim()) return;
    
    const updatedGroup = {
      ...editingGroup,
      guide: {
        ...editingGroup.guide,
        steps: [...editingGroup.guide.steps, { text: newStep.trim() }]
      }
    };
    setEditingGroup(updatedGroup);
    setNewStep('');
  };

  const handleRemoveStep = (index: number) => {
    if (!editingGroup) return;
    
    const updatedSteps = [...editingGroup.guide.steps];
    const removedStep = updatedSteps.splice(index, 1)[0];
    
    const updatedGroup = {
      ...editingGroup,
      guide: {
        ...editingGroup.guide,
        steps: updatedSteps
      }
    };
    setEditingGroup(updatedGroup);

    // Delete image if it exists
    if (removedStep.imageUrl) {
      axios.delete(`${import.meta.env.VITE_API_URL}/api/content/delete-image`, {
        data: { imageUrl: removedStep.imageUrl }
      }).catch(error => console.error('Error deleting image:', error));
    }
  };

  const handleStepImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, stepIndex: number) => {
    if (!editingGroup || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/content/upload-image`,
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedSteps = [...editingGroup.guide.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        imageUrl: response.data.imageUrl // Используем URL с сервера
      };
      
      const updatedGroup = {
        ...editingGroup,
        guide: {
          ...editingGroup.guide,
          steps: updatedSteps
        }
      };
      setEditingGroup(updatedGroup);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Ошибка загрузки изображения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleRemoveStepImage = (stepIndex: number) => {
    if (!editingGroup) return;
    
    const updatedSteps = [...editingGroup.guide.steps];
    const oldImageUrl = updatedSteps[stepIndex].imageUrl;
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      imageUrl: undefined
    };
    
    const updatedGroup = {
      ...editingGroup,
      guide: {
        ...editingGroup.guide,
        steps: updatedSteps
      }
    };
    setEditingGroup(updatedGroup);

    if (oldImageUrl) {
      axios.delete(`${import.meta.env.VITE_API_URL}/api/content/delete-image`, {
        data: { imageUrl: oldImageUrl }
      }).catch(error => console.error('Error deleting image:', error));
    }
  };

  if (isLoading) return <div className="acc-loading">Загрузка...</div>;
  if (!content) return <div className="acc-error">Ошибка загрузки контента</div>;

  return (
    <div className="acc-container">
      <h1 className="acc-main-title">Управление чат-ботом</h1>
      
      <div className="acc-section">
        <h2 className="acc-section-title">Приветственное сообщение</h2>
        <textarea
          className="acc-textarea"
          value={content.initialMessage}
          onChange={(e) => setContent({ ...content, initialMessage: e.target.value })}
          rows={3}
          required
        />
      </div>
      
      <div className="acc-section">
        <h2 className="acc-section-title">Группы ключевых слов</h2>
        <button onClick={handleAddKeywordGroup} className="acc-btn acc-btn-add">
          + Создать группу
        </button>
        
        <div className="acc-groups-grid">
          {content.keywordGroups.map((group) => (
            <div key={group.name} className="acc-group-item">
              <div className="acc-group-header">
                <h3 className="acc-group-title">{group.name}</h3>
                <div className="acc-group-actions">
                  <button 
                    onClick={() => handleEditGroup(group)}
                    className="acc-btn acc-btn-edit"
                  >
                    Редактировать
                  </button>
                  <button 
                    onClick={() => handleDeleteGroup(group)}
                    className="acc-btn acc-btn-delete"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <div className="acc-group-keywords">
                {group.keywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="acc-keyword-badge">{kw}</span>
                ))}
                {group.keywords.length > 3 && (
                  <span className="acc-keyword-more">+{group.keywords.length - 3} ещё</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {editingGroup && (
        <div className="acc-modal-overlay">
          <div className="acc-modal">
            <div className="acc-modal-content">
              <h2 className="acc-modal-title">Редактирование группы</h2>
              
              <div className="acc-form-group">
                <label className="acc-label">Название группы</label>
                <input
                  type="text"
                  className="acc-input"
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup({
                    ...editingGroup,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="acc-form-group">
                <label className="acc-label">Ключевые слова</label>
                <div className="acc-keywords-list">
                  {editingGroup.keywords.map((keyword, index) => (
                    <div key={index} className="acc-keyword-item">
                      {keyword}
                      <button 
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="acc-btn-remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="acc-add-keyword">
                  <input
                    type="text"
                    className="acc-input"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Добавить ключевое слово"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <button onClick={handleAddKeyword} className="acc-btn acc-btn-add">
                    Добавить
                  </button>
                </div>
              </div>
              
              <div className="acc-form-group">
                <label className="acc-section-title">Шаги решения</label>
                <ol className="acc-steps-list">
                  {editingGroup.guide.steps.map((step, index) => (
                    <li key={index} className="acc-step-item">
                      <div className="acc-step-content">
                        <div className="acc-step-section">
                          <h4 className="acc-step-subtitle">Текст шага</h4>
                          <div className="acc-step-text">{step.text}</div>
                        </div>
                        
                        <div className="acc-step-section">
                          <h4 className="acc-step-subtitle">Изображение</h4>
                          <div className="acc-step-image-controls">
                            {step.imageUrl ? (
                              <div className="acc-step-image-preview">
                              <img 
                                src={step.imageUrl} // Уже содержит полный или относительный путь
                                alt="Превью шага" 
                                className="acc-step-preview-img"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              </div>
                            ) : (
                              <div className="acc-step-no-image">Изображение не добавлено</div>
                            )}
                            <div className="acc-image-control-buttons">
                              <label className="acc-image-upload-btn">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleStepImageUpload(e, index)}
                                  className="acc-file-input"
                                />
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5V15H11V5H5L12 2L19 5H13Z" fill="currentColor"/>
                                </svg>
                              </label>
                              {step.imageUrl && (
                                <button
                                  onClick={() => handleRemoveStepImage(index)}
                                  className="acc-btn-remove-image"
                                  title="Удалить изображение"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveStep(index)}
                        className="acc-btn-remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="acc-add-step">
                  <textarea
                    className="acc-textarea"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Добавить новый шаг"
                    rows={2}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddStep()}
                  />
                  <button onClick={handleAddStep} className="acc-btn acc-btn-add">
                    Добавить шаг
                  </button>
                </div>
              </div>
              
              <div className="acc-form-group">
                <label className="acc-label">Завершающий вопрос</label>
                <input
                  type="text"
                  className="acc-input"
                  value={editingGroup.guide.followUp}
                  onChange={(e) => setEditingGroup({
                    ...editingGroup,
                    guide: {
                      ...editingGroup.guide,
                      followUp: e.target.value
                    }
                  })}
                />
              </div>
              
              <div className="acc-modal-actions">
                <button 
                  onClick={() => handleUpdateGroup(editingGroup)}
                  className="acc-btn acc-btn-save"
                >
                  Сохранить
                </button>
                <button 
                  onClick={() => setEditingGroup(null)}
                  className="acc-btn acc-btn-cancel"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="acc-actions">
        <button 
          onClick={handleSaveContent}
          className="acc-btn acc-btn-save-all"
          disabled={!content}
        >
          Сохранить все изменения
        </button>
      </div>
    </div>
  );
};

export default AdminChatContent;