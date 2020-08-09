import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import React, { FC } from 'react'
import { Route } from 'react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'

import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import { Provider } from './store'

const App: FC = () => (
  <IonApp>
    <Provider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Cards} />
          <Route path="/transactions/:accountId" component={Transactions} />
        </IonRouterOutlet>
      </IonReactRouter>
    </Provider>
  </IonApp>
)

export default App
