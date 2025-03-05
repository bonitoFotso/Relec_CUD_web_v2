# Documentation API

## Base URL
`127.0.0.1:8000/api/v1/`

## Authentication
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/login` | POST | Authentification utilisateur | email, password |
| `/logout` | POST | Déconnexion | - |

*Note: L'authentification utilise des tokens Bearer*

## Gestion des Utilisateurs
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/users/index` | GET | Liste tous les utilisateurs | - |
| `/users/create` | GET | Affiche le formulaire de création | - |
| `/users/store` | POST | Enregistre un nouvel utilisateur | name, email, phone, sex, password, role |
| `/users/edit` | POST | Affiche le formulaire d'édition | id |
| `/users/update` | GET | Met à jour un utilisateur | name, email, phone, sex, password, role |
| `/users/delete` | POST | Supprime un utilisateur | id |
| `/users/assignpermissions` | POST | Assigne des permissions | role_id, permissions |

## Gestion des Missions
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/missions/index` | GET | Liste toutes les missions | - |
| `/missions/show` | POST | Affiche une mission spécifique | id |
| `/missions/create` | GET | Affiche le formulaire de création | - |
| `/missions/store` | POST | Enregistre une nouvelle mission | user_id, title, description, street_id, intervention_type_id |
| `/missions/edit` | POST | Affiche le formulaire d'édition | id |
| `/missions/delete` | POST | Supprime une mission | id |
| `/missions/assign-mission-agents` | POST | Assigne un agent à une mission | user_id, mission_id |

## Gestion des Autocollants (Stickers)
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/stickers/index` | GET | Liste tous les autocollants | - |
| `/stickers/show` | POST | Affiche un autocollant spécifique | id |
| `/stickers/create` | GET | Affiche le formulaire de création | - |
| `/stickers/store` | POST | Enregistre un nouvel autocollant | count, mission_id, equipment_type_id |