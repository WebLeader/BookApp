export function NaviGoBack(navigator) {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
}

export function isEmptyObject(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}

export function NaviGoByName(navigator, name) {
    const routes = navigator.state.routeStack;
    let destinationRoute = '';
    for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].name === name) {
            destinationRoute = navigator.getCurrentRoutes()[i];
            navigator.popToRoute(destinationRoute);
            return true;
        }
    }
    return false;
}