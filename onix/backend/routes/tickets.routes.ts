import { Router } from 'express';
import { 
  getTickets, 
  createTicket, 
  updateTicket, 
  getTicketById 
} from '../controllers/tickets.controller';

const router = Router();

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);

export default router;