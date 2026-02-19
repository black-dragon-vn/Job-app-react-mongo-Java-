import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

export const sucessNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        withCloseButton: true,
        icon: <IconCheck style={{ width: "90%", height: "90%" }} />,
        color: "teal",
        withBorder: true,
        autoClose: 3000,
        className: "!border-green-500"
    });
}

export const errNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        withCloseButton: true,
        icon: <IconX style={{ width: "90%", height: "90%" }} />,
        color: "red",
        withBorder: true,
        autoClose: 4000,
        className: "!border-red-500"
    });
}

export const infoNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        withCloseButton: true,
        icon: <IconInfoCircle style={{ width: "90%", height: "90%" }} />,
        color: "blue",
        withBorder: true,
        autoClose: 3000,
        className: "!border-blue-500"
    });
}

export const warningNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        color: 'yellow',
        autoClose: 4000,
        position: 'top-right',
    });
};