import ProfDashboardPage from '../pages/prof/ProfDashboardPage';
import EmploiDuTempsPage from '../pages/prof/EmploiDuTempsPage';
import ReservationPage from '../pages/prof/ReservationPage';
import MesReservationsPage from '../pages/prof/MesReservationsPage';
import ReclamationsPage from '../pages/prof/ReclamationsPage';
import NouvelleReclamationPage from '../pages/prof/NouvelleReclamationPage';

import { IconGrid, IconTimetable, IconPlus, IconList, IconMessage } from '../components/Icons';

export const PROF_ROUTES = [
  {
    id: 'prof-dashboard',
    path: '/prof/dashboard',
    label: 'Tableau de bord',
    Icon: IconGrid,
    component: ProfDashboardPage,
    badge: 0
  },
  {
    id: 'emploi',
    path: '/prof/emploi',
    label: 'Mon emploi du temps',
    Icon: IconTimetable,
    component: EmploiDuTempsPage,
    badge: 0
  },
  {
    id: 'reservation',
    path: '/prof/reservation',
    label: 'Nouvelle réservation',
    Icon: IconPlus,
    component: ReservationPage,
    badge: 0
  },
  {
    id: 'mes-res',
    path: '/prof/mes-reservations',
    label: 'Mes réservations',
    Icon: IconList,
    component: MesReservationsPage,
    badge: 0
  },
  {
    id: 'nouvelle-reclamation',
    path: '/prof/nouvelle-reclamation',
    label: 'Nouvelle réclamation',
    Icon: IconPlus,
    component: NouvelleReclamationPage,
    badge: 0
  },
  {
    id: 'reclamations',
    path: '/prof/reclamations',
    label: 'Mes réclamations',
    Icon: IconMessage,
    component: ReclamationsPage,
    badge: 2
  }
];
