import {
  BarChart4,
  Calendar,
  AlertCircle,
  Settings,
  User,
  Map,
} from "lucide-react";

export const faqData = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    icon: <BarChart4 className="h-5 w-5" />,
    questions: [
      {
        id: "dashboard-overview",
        question: "Comment lire les statistiques du tableau de bord ?",
        answer: (
          <div>
            <p>Le tableau de bord affiche plusieurs indicateurs clés :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Nombre de missions</strong> : Total des missions en
                cours et planifiées
              </li>
              <li>
                <strong>Nombre d'agents</strong> : Effectif total des agents
                disponibles
              </li>
              <li>
                <strong>Nombre de stickers</strong> : Inventaire des stickers
                d'identification
              </li>
              <li>
                <strong>Missions complétées</strong> : Pourcentage des missions
                terminées
              </li>
            </ul>
            <p className="mt-2">
              Les graphiques vous permettent de visualiser la répartition des
              missions par type d'intervention et l'évolution mensuelle de
              l'utilisation des stickers.
            </p>
          </div>
        ),
      },
      {
        id: "dashboard-alerts",
        question: "Comment gérer les alertes du tableau de bord ?",
        answer: (
          <div>
            <p>Les alertes sont classées par niveau d'importance :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Erreur (rouge)</strong> : Nécessite une action immédiate
              </li>
              <li>
                <strong>Avertissement (orange)</strong> : À surveiller mais
                moins urgent
              </li>
            </ul>
            <p className="mt-2">Pour chaque alerte, vous pouvez :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Cliquer sur l'alerte pour obtenir plus de détails</li>
              <li>Utiliser le bouton "Résoudre" pour marquer comme traitée</li>
              <li>
                Accéder directement à la section concernée en cliquant sur
                "Voir"
              </li>
            </ol>
          </div>
        ),
      },
    ],
  },
  {
    id: "missions",
    title: "Gestion des missions",
    icon: <Calendar className="h-5 w-5" />,
    questions: [
      {
        id: "mission-create",
        question: "Comment créer une nouvelle mission ?",
        answer: (
          <div>
            <p>Pour créer une nouvelle mission :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Missions" dans le menu</li>
              <li>Cliquez sur le bouton "Créer une mission"</li>
              <li>
                Remplissez le formulaire avec les informations nécessaires :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Titre et description de la mission</li>
                  <li>Type d'intervention</li>
                  <li>Lieu d'exécution</li>
                  <li>Date et heure prévues</li>
                  <li>Équipements concernés</li>
                </ul>
              </li>
              <li>Cliquez sur "Enregistrer" pour créer la mission</li>
            </ol>
            <p className="mt-2">
              Une fois créée, la mission apparaîtra dans la liste des missions à
              assigner.
            </p>
          </div>
        ),
      },
      {
        id: "mission-assign",
        question: "Comment assigner un agent à une mission ?",
        answer: (
          <div>
            <p>Pour assigner un agent à une mission :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Missions"</li>
              <li>Trouvez la mission concernée et cliquez sur "Détails"</li>
              <li>Dans la page de détails, cliquez sur "Assigner un agent"</li>
              <li>
                Sélectionnez un agent dans la liste déroulante des agents
                disponibles
              </li>
              <li>Cliquez sur "Confirmer l'assignation"</li>
            </ol>
            <p className="mt-2">
              Une notification sera envoyée à l'agent pour l'informer de sa
              nouvelle mission. Vous pouvez suivre le statut de la mission (En
              attente, En cours, Terminée) depuis la liste des missions.
            </p>
          </div>
        ),
      },
      {
        id: "mission-update",
        question: "Comment modifier ou supprimer une mission ?",
        answer: (
          <div>
            <p>Pour modifier une mission existante :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Missions"</li>
              <li>Trouvez la mission à modifier et cliquez sur "Détails"</li>
              <li>Cliquez sur l'icône "Modifier" (crayon)</li>
              <li>Effectuez vos changements dans le formulaire</li>
              <li>Cliquez sur "Enregistrer les modifications"</li>
            </ol>

            <p className="mt-3">Pour supprimer une mission :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Missions"</li>
              <li>Trouvez la mission à supprimer</li>
              <li>Cliquez sur l'icône "Supprimer" (poubelle)</li>
              <li>Confirmez la suppression dans la boîte de dialogue</li>
            </ol>
            <p className="mt-2 text-red-500">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Attention : La suppression d'une mission est définitive.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "equipements",
    title: "Gestion des équipements",
    icon: <Settings className="h-5 w-5" />,
    questions: [
      {
        id: "equipements-types",
        question: "Quels types d'équipements sont gérés par l'application ?",
        answer: (
          <div>
            <p>L'application permet de gérer quatre types d'équipements :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Lampadaires</strong> : Éclairage public de différents
                types (LED, HPS, MH, etc.)
              </li>
              <li>
                <strong>Compteurs</strong> : Dispositifs de mesure de
                consommation électrique
              </li>
              <li>
                <strong>Armoires électriques</strong> : Boîtiers de contrôle et
                de distribution
              </li>
              <li>
                <strong>Sous-stations</strong> : Installations de transformation
                et de distribution
              </li>
            </ul>
            <p className="mt-2">
              Chaque équipement possède ses propres caractéristiques et données
              techniques que vous pouvez consulter et modifier.
            </p>
          </div>
        ),
      },
      {
        id: "equipements-position",
        question: "Comment mettre à jour la position d'un équipement ?",
        answer: (
          <div>
            <p>Pour mettre à jour la position d'un équipement :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Équipements"</li>
              <li>
                Sélectionnez le type d'équipement (Lampadaires, Compteurs, etc.)
              </li>
              <li>Trouvez l'équipement concerné dans la liste</li>
              <li>Cliquez sur "Modifier la position"</li>
              <li>
                Sur la carte qui s'affiche, vous pouvez :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Déplacer le marqueur à la position souhaitée</li>
                  <li>Entrer manuellement les coordonnées GPS</li>
                  <li>Rechercher une adresse pour positionner l'équipement</li>
                </ul>
              </li>
              <li>
                Cliquez sur "Enregistrer" pour confirmer la nouvelle position
              </li>
            </ol>
            <p className="mt-2">
              Les changements seront immédiatement reflétés sur toutes les
              cartes et dans les données des missions.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "consommation",
    title: "Suivi de consommation",
    icon: <BarChart4 className="h-5 w-5" />,
    questions: [
      {
        id: "consommation-periods",
        question: "Comment changer la période d'analyse de consommation ?",
        answer: (
          <div>
            <p>Pour modifier la période d'analyse de consommation :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Consommation"</li>
              <li>Utilisez le sélecteur de période en haut de la page</li>
              <li>
                Choisissez parmi les options disponibles :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>
                    <strong>Journalière</strong> : Données heure par heure sur
                    24h
                  </li>
                  <li>
                    <strong>Hebdomadaire</strong> : Consommation par jour sur
                    une semaine
                  </li>
                  <li>
                    <strong>Mensuelle</strong> : Consommation par jour sur un
                    mois
                  </li>
                  <li>
                    <strong>Annuelle</strong> : Consommation par mois sur une
                    année
                  </li>
                </ul>
              </li>
            </ol>
            <p className="mt-2">
              Les graphiques et tableaux se mettront automatiquement à jour pour
              refléter la période sélectionnée.
            </p>
          </div>
        ),
      },
      {
        id: "consommation-filtres",
        question: "Comment filtrer les données de consommation par catégorie ?",
        answer: (
          <div>
            <p>Pour filtrer les données de consommation par catégorie :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Consommation"</li>
              <li>
                Utilisez les onglets de filtrage pour sélectionner :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>
                    <strong>Tous</strong> : Affiche toutes les catégories
                    d'équipements
                  </li>
                  <li>
                    <strong>LED</strong> : N'affiche que les équipements de type
                    LED
                  </li>
                  <li>
                    <strong>Décharges</strong> : N'affiche que les équipements à
                    décharge
                  </li>
                </ul>
              </li>
              <li>
                Vous pouvez également cliquer sur les éléments de la légende du
                graphique pour masquer/afficher certains types
              </li>
            </ol>
            <p className="mt-2">
              Les totaux de consommation et de coûts se mettront à jour
              automatiquement en fonction des filtres appliqués.
            </p>
          </div>
        ),
      },
      {
        id: "consommation-interpretation",
        question:
          "Comment interpréter les données de rendement des équipements ?",
        answer: (
          <div>
            <p>
              Les données de rendement vous aident à évaluer l'efficacité
              énergétique de vos équipements :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Consommation moyenne</strong> : Indique la consommation
                en kWh par nuit pour chaque type d'équipement
              </li>
              <li>
                <strong>Rendement</strong> : Mesuré en lumens par watt, ce
                chiffre indique l'efficacité lumineuse de l'équipement
              </li>
              <li>
                <strong>Coût</strong> : Calculé sur la base du tarif kWh
                configuré (actuellement 50 XAF/kWh)
              </li>
            </ul>
            <p className="mt-2">
              Un rendement plus élevé indique une meilleure efficacité. Les
              équipements LED ont généralement un meilleur rendement que les
              équipements à décharge.
            </p>
            <p className="mt-2">Pour optimiser votre consommation :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Remplacez progressivement les équipements à faible rendement
              </li>
              <li>
                Ajustez les heures de fonctionnement (on_time et off_time)
              </li>
              <li>
                Surveillez les variations saisonnières pour planifier la
                maintenance
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    id: "permissions",
    title: "Gestion des permissions",
    icon: <User className="h-5 w-5" />,
    questions: [
      {
        id: "permissions-roles",
        question: "Quels sont les différents rôles disponibles ?",
        answer: (
          <div>
            <p>
              L'application propose plusieurs rôles avec différents niveaux
              d'accès :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Administrateur</strong> : Accès complet à toutes les
                fonctionnalités
              </li>
              <li>
                <strong>Agent</strong> : Accès aux missions assignées et aux
                rapports d'intervention
              </li>
              <li>
                <strong>Superviseur</strong> : Gestion des missions et des
                agents, accès aux rapports
              </li>
              <li>
                <strong>Consultant</strong> : Accès en lecture seule aux données
                et statistiques
              </li>
            </ul>
            <p className="mt-2">
              Chaque rôle dispose de permissions spécifiques définies dans le
              système.
            </p>
          </div>
        ),
      },
      {
        id: "permissions-assign",
        question: "Comment attribuer des rôles aux utilisateurs ?",
        answer: (
          <div>
            <p>Pour attribuer ou modifier les rôles des utilisateurs :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Accédez à la section "Administration" puis "Utilisateurs"</li>
              <li>Sélectionnez l'utilisateur concerné dans la liste</li>
              <li>Cliquez sur "Gérer les rôles"</li>
              <li>
                Dans la fenêtre qui s'affiche, cochez les rôles à attribuer
              </li>
              <li>Cliquez sur "Enregistrer" pour appliquer les changements</li>
            </ol>
            <p className="mt-2">
              Les changements de rôle prennent effet immédiatement.
              L'utilisateur concerné devra peut-être se reconnecter pour que
              toutes les modifications soient appliquées.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "carte",
    title: "Utilisation de la carte",
    icon: <Map className="h-5 w-5" />,
    questions: [
      {
        id: "carte-navigation",
        question: "Comment naviguer sur la carte des équipements ?",
        answer: (
          <div>
            <p>Pour naviguer efficacement sur la carte :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Zoom</strong> : Utilisez la molette de la souris ou les
                boutons + / - en haut à gauche
              </li>
              <li>
                <strong>Déplacement</strong> : Cliquez et maintenez le bouton
                gauche de la souris pour déplacer la carte
              </li>
              <li>
                <strong>Filtres</strong> : Utilisez les options de filtre pour
                afficher uniquement certains types d'équipements
              </li>
              <li>
                <strong>Recherche</strong> : Entrez une adresse ou les
                coordonnées dans la barre de recherche
              </li>
            </ul>
            <p className="mt-2">
              Vous pouvez également basculer entre différentes vues (Plan,
              Satellite) en utilisant le sélecteur en haut à droite de la carte.
            </p>
          </div>
        ),
      },
      {
        id: "carte-equipements",
        question: "Comment voir les détails d'un équipement sur la carte ?",
        answer: (
          <div>
            <p>Pour consulter les détails d'un équipement sur la carte :</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>
                Repérez l'équipement sur la carte (chaque type a une icône
                distinctive)
              </li>
              <li>Cliquez sur l'icône de l'équipement</li>
              <li>
                Une fenêtre contextuelle s'ouvrira avec les informations
                essentielles :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Identifiant et type d'équipement</li>
                  <li>État de fonctionnement actuel</li>
                  <li>Caractéristiques techniques</li>
                  <li>Date de dernière maintenance</li>
                </ul>
              </li>
              <li>
                Pour des informations plus détaillées, cliquez sur "Voir détails
                complets"
              </li>
            </ol>
            <p className="mt-2">
              Vous pouvez également créer une mission directement depuis cette
              vue en cliquant sur "Créer une intervention".
            </p>
          </div>
        ),
      },
    ],
  },
];
