//import { templatesSaga } from "./data/templates/sagas";
//import { appWizardSaga } from "./data/app-wizard/sagas";

const startupSagas = [
];

export const runApplicationSagas = (sagaMiddleware) => {
    startupSagas.forEach(sagaMiddleware.run);
};
