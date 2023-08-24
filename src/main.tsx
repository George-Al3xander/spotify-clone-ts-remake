import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './redux/store.tsx'
import { Provider } from 'react-redux'

import './index.css'
import { HashRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Provider store={store}>
          <App />
    </Provider>
  </HashRouter>
)
