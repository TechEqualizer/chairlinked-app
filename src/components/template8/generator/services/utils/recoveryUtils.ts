
export class RecoveryUtils {
  static dispatchSaveEvents(url: string, businessName: string, isNewDemo: boolean) {
    try {
      // Dispatch custom event for save completion
      const saveEvent = new CustomEvent('demoSaveComplete', {
        detail: {
          url,
          businessName,
          isNewDemo,
          timestamp: Date.now()
        }
      });
      
      window.dispatchEvent(saveEvent);
      
      console.log('[RecoveryUtils] Save events dispatched successfully');
    } catch (error) {
      console.warn('[RecoveryUtils] Failed to dispatch save events:', error);
    }
  }
}
