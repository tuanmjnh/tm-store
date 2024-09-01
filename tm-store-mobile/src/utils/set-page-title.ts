const { VITE_APP_NAME } = import.meta.env

export default function setPageTitle(routerTitle?: string): void {
  window.document.title = routerTitle ? `${routerTitle} | ${VITE_APP_NAME}` : `${VITE_APP_NAME}`;
}
