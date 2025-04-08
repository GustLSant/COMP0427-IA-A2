import App from './App';
import ChatPage from './ChatPage';
import ContractReviewPage from './ContractReviewPage';


const routes = [
  {
    path: '/',
    element: <App />,
    children: [
        {
            path: '/',
            element: <ChatPage />,
        },
        {
            path: '/analisar-contrato',
            element: <ContractReviewPage />,
        },
    ]
  },
]

export default routes;