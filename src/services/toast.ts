import { toastController } from "$ionic/svelte";

export const toast = async (message: string, color: string = 'danger', duration: number = 3000) => {
    const toast = await toastController.create({
      message: message,
      color: color,
      cssClass: "toast", // see: /src/theme/variables.css
      position: "top",
      buttons: [{ icon: 'close', handler: () => {console.log('dismiss')} }],
      duration: duration
    });
    await toast.present();
  }
