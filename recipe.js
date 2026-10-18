// Shared behavior for recipe pages: remember checkboxes, reset button, keep screen awake.
(function () {
    const key = 'checked:' + location.pathname;
    const maxAge = 12 * 60 * 60 * 1000; // forget progress after 12 hours
    const boxes = [...document.querySelectorAll('.checklist input[type="checkbox"]')];

    function save() {
        const checked = boxes.flatMap((box, i) => box.checked ? [i] : []);
        try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), checked })); } catch (e) {}
    }

    try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (saved && Date.now() - saved.t < maxAge) {
            saved.checked.forEach(i => { if (boxes[i]) boxes[i].checked = true; });
        }
    } catch (e) {}

    boxes.forEach(box => box.addEventListener('change', save));

    const reset = document.querySelector('.reset-button');
    if (reset) reset.addEventListener('click', () => {
        boxes.forEach(box => { box.checked = false; });
        save();
    });

    // Keep the screen on while cooking; the lock is released whenever the tab is hidden.
    function keepAwake() {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
            navigator.wakeLock.request('screen').catch(() => {});
        }
    }
    keepAwake();
    document.addEventListener('visibilitychange', keepAwake);
})();
