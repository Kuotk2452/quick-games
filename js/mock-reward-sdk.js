// Mock Ad SDK for Quick Games Studio
// Simulates a Rewarded Video Ad for demo purposes.
window.QuickGamesAdSDK = {
  showRewardedVideo: function(onSuccess, onCancel) {
    // Create an overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = '#000';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = '#fff';
    overlay.style.fontFamily = 'sans-serif';

    const title = document.createElement('h2');
    title.innerText = 'ADVERTISEMENT';
    title.style.marginBottom = '20px';
    
    const countdownText = document.createElement('div');
    countdownText.style.fontSize = '48px';
    countdownText.style.fontWeight = 'bold';
    countdownText.style.marginBottom = '30px';

    const skipBtn = document.createElement('button');
    skipBtn.innerText = 'Close Ad';
    skipBtn.style.padding = '10px 20px';
    skipBtn.style.fontSize = '16px';
    skipBtn.style.background = '#333';
    skipBtn.style.color = '#fff';
    skipBtn.style.border = 'none';
    skipBtn.style.borderRadius = '5px';
    skipBtn.style.cursor = 'pointer';
    skipBtn.style.display = 'none'; // hide initially

    overlay.appendChild(title);
    overlay.appendChild(countdownText);
    overlay.appendChild(skipBtn);
    document.body.appendChild(overlay);

    let timeLeft = 3;
    countdownText.innerText = timeLeft;

    const timer = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        countdownText.innerText = timeLeft;
      } else {
        clearInterval(timer);
        countdownText.innerText = 'Reward Granted!';
        skipBtn.style.display = 'block';
        skipBtn.innerText = 'Collect Reward';
        
        skipBtn.onclick = () => {
          document.body.removeChild(overlay);
          if (onSuccess) onSuccess();
        };
      }
    }, 1000);

    // If user somehow manages to close early (simulated by adding a tiny hidden close btn)
    // we could call onCancel(). For now, simple flow.
  }
};
