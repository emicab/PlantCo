import {
  createIcons,
  Check,
  X,
} from "../node_modules/lucide/dist/esm/lucide.js";

export const iconoNotificacion = (elem, iconName, color) => {
  elem.innerHTML = `<i data-lucide="${iconName}" class="text-md m-auto text-center font-bold ${color}"></i>`;
  createIcons({
    icons: {
      Check,
      X,
    },
  });
};
