
import { toast } from 'react-semantic-toasts';

const toastTypes = {
    error: {
        icon: "exclamation triangle",
        title: "Error",
        type: "error"
    },
    warning: {
        icon: "exclamation",
        title: "Warning",
        type: "warning"
    },
    info: {
        icon: "info",
        title: "Info",
        type: "info"
    },
    success: {
        icon: "check",
        title: "Success",
        type: "success"
    }
};

export function displayMessage(type, description) {
    toast({
        type,
        title: toastTypes[type].title,
        icon: toastTypes[type].icon,
        description,
        animation: 'slide left',
        time: 5000
    });
}

export function parseUrl(url) {
    const wsPrefix = 'ws://';
    const wssPrefix = 'wss://';
    let prefix = '';

    if (url.indexOf(wsPrefix) > -1) {
        prefix = wsPrefix;
        url = url.replace(wsPrefix, '');
    }
    else if (url.indexOf(wssPrefix) > -1) {
        prefix = wssPrefix;
        url = url.replace(wssPrefix, '');
    }

    return { prefix, url };
}
