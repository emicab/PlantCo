import {
  createIcons,
  Check,
  X,
} from "https://esm.sh/lucide@1.47.0";

export const iconoNotificacion = (elem, iconName, color) => {
  elem.innerHTML = `<i data-lucide="${iconName}" class="text-md m-auto text-center font-bold ${color}"></i>`;
  createIcons({
    icons: {
      Check,
      X,
    },
  });
};
