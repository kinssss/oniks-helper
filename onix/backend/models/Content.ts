import { Schema, model, Document } from 'mongoose';

interface IGuideStep {
  text: string;
  imageUrl?: string; 
}

interface IGuide {
  steps: IGuideStep[];
  followUp: string;
}

interface IKeywordGroup {
  name: string;
  keywords: string[];
  guide: IGuide;
}

interface ITicketFormFields {
  name: { label: string; placeholder: string };
  cabinet: { label: string; placeholder: string };
  problem: { label: string; placeholder: string };
}

interface ITicketForm {
  title: string;
  fields: ITicketFormFields;
  buttons: {
    submit: string;
    cancel: string;
  };
}

interface IResponses {
  problemSolved: string;
  needHelp: string;
  ticketCreated: string;
  ticketError: string;
  cancelHelp: string;
}

interface IButtons {
  yes: string;
  no: string;
  problemSolved: string;
  needHelp: string;
}

export interface IContent extends Document {
  initialMessage: string;
  keywordGroups: IKeywordGroup[];
  responses: IResponses;
  ticketForm: ITicketForm;
  buttons: IButtons;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  initialMessage: { 
    type: String, 
    required: [true, 'Initial message is required'],
    default: 'Добрый день! Чем я могу вам помочь?'
  },
  keywordGroups: {
    type: [{
      name: {
        type: String,
        required: [true, 'Group name is required'],
        default: 'Новая группа'
      },
      keywords: {
        type: [String],
        required: true,
        default: []
      },
      guide: {
        steps: {
          type: [{
            text: {
              type: String,
              required: [true, 'Step text is required']
            }
          }],
          required: true,
          default: []
        },
        followUp: {
          type: String,
          required: [true, 'Follow-up message is required'],
          default: 'Помогло ли это решить вашу проблему?'
        },
        imageUrl: {
          type: String,
          required: false
        }
      }
    }],
    required: true,
    default: []
  },
  responses: {
    problemSolved: {
      type: String,
      default: 'Рад был помочь! Обращайтесь, если будут ещё вопросы.'
    },
    needHelp: {
      type: String,
      default: 'Пожалуйста, опишите вашу проблему подробнее.'
    },
    ticketCreated: {
      type: String,
      default: 'Ваш запрос успешно создан. Скоро с вами свяжутся.'
    },
    ticketError: {
      type: String,
      default: 'Произошла ошибка при создании запроса. Пожалуйста, попробуйте позже.'
    },
    cancelHelp: {
      type: String,
      default: 'Хорошо, если вам снова понадобится помощь, просто напишите.'
    }
  },
  ticketForm: {
    title: {
      type: String,
      default: 'Создать запрос в техподдержку'
    },
    fields: {
      name: {
        label: {
          type: String,
          default: 'Ваше имя'
        },
        placeholder: {
          type: String,
          default: 'Введите ваше имя'
        }
      },
      cabinet: {
        label: {
          type: String,
          default: 'Номер кабинета'
        },
        placeholder: {
          type: String,
          default: 'Введите номер кабинета'
        }
      },
      problem: {
        label: {
          type: String,
          default: 'Описание проблемы'
        },
        placeholder: {
          type: String,
          default: 'Опишите вашу проблему'
        }
      }
    },
    buttons: {
      submit: {
        type: String,
        default: 'Отправить'
      },
      cancel: {
        type: String,
        default: 'Отмена'
      }
    }
  },
  buttons: {
    yes: {
      type: String,
      default: 'Да'
    },
    no: {
      type: String,
      default: 'Нет'
    },
    problemSolved: {
      type: String,
      default: 'Проблема решена'
    },
    needHelp: {
      type: String,
      default: 'Нужна помощь'
    }
  },
  images: {
    type: [String],
    default: []
  }
}, { 
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt' 
  } 
});

ContentSchema.index({ updatedAt: -1 });

export default model<IContent>('Content', ContentSchema);