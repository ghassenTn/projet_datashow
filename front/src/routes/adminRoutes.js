import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import GestionUtilisateursPage from '../pages/admin/GestionUtilisateursPage';
import GestionSemainesPage from '../pages/admin/GestionSemainesPage';
import GestionSeancesPage from '../pages/admin/GestionSeancesPage';
import GestionSallesPage from '../pages/admin/GestionSallesPage';
import GestionParcPage from '../pages/admin/GestionParcPage';
import GestionReparationsPage from '../pages/admin/GestionReparationsPage';
import GestionReclamationsPage from '../pages/admin/GestionReclamationsPage';
import GestionToutesReservationsPage from '../pages/admin/GestionToutesReservationsPage';

import { IconGrid, IconUsers, IconCal, IconClock, IconBuilding, IconMonitor, IconAlert, IconList } from '../components/Icons';

export const ADMIN_ROUTES = [
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    label: 'Tableau de bord',
    Icon: IconGrid,
    component: AdminDashboardPage,
    badge: 0
  },
  {
    id: 'admin-parc',
    path: '/admin/parc',
    label: 'Parc data shows',
    Icon: IconMonitor,
    component: GestionParcPage,
    badge: 0
  },
  {
    id: 'admin-rec',
    path: '/admin/reclamations',
    label: 'Toutes les réclamations',
    Icon: IconAlert,
    component: GestionReclamationsPage,
    badge: 5
  },
  {
    id: 'admin-res',
    path: '/admin/reservations',
    label: 'Toutes les réservations',
    Icon: IconList,
    component: GestionToutesReservationsPage,
    badge: 0
  },
  {
    id: 'admin-reparations',
    path: '/admin/reparations',
    label: 'Toutes les réparations',
    Icon: IconAlert,
    component: GestionReparationsPage,
    badge: 0
  },
  {
    id: 'admin-semaines',
    path: '/admin/semaines',
    label: 'Semaines de réservation',
    Icon: IconCal,
    component: GestionSemainesPage,
    badge: 0
  },
  {
    id: 'admin-seances',
    path: '/admin/seances',
    label: 'Toutes les séances',
    Icon: IconClock,
    component: GestionSeancesPage,
    badge: 0
  },
  {
    id: 'admin-salles',
    path: '/admin/salles',
    label: 'Toutes les salles',
    Icon: IconBuilding,
    component: GestionSallesPage,
    badge: 0
  },
  {
    id: 'admin-users',
    path: '/admin/users',
    label: 'Tous les utilisateurs',
    Icon: IconUsers,
    component: GestionUtilisateursPage,
    badge: 0
  }
];
