document.addEventListener('DOMContentLoaded', () => {
  const linkDropdown = document.getElementById('linkDropdown');
  const linkInput = document.getElementById('linkInput');
  const testButton = document.getElementById('testButton');
  const resultDisplay = document.getElementById('resultDisplay');

  // Fetch all anchor links on the page and populate the dropdown
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          return Array.from(document.querySelectorAll('a')).map(a => ({
            href: a.href,
            text: a.textContent.trim() || a.href
          }));
        },
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const links = results[0].result;
          links.forEach(link => {
            const option = document.createElement('option');
            option.value = link.href;
            option.textContent = link.text.length > 100 ? link.text.substring(0, 100) + '...' : link.text;
            linkDropdown.appendChild(option);
          });
        } else {
          console.error('Failed to fetch links from the page.');
        }
      }
    );
  });

  // Update the text field when a dropdown option is selected
  linkDropdown.addEventListener('change', () => {
    linkInput.value = linkDropdown.value;
  });

  // Handle the "Test" button click
  testButton.addEventListener('click', async () => {
    const link = linkInput.value;
    if (link) {
      console.log(`Testing link: ${link}`);
      let predictionResult = '';
      let urlResult = '';

      try {
        // Call the /makePrediction endpoint
        const predictionResponse = await fetch('http://127.0.0.1:5000/makePrediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: link }),
        });
        const predictionData = await predictionResponse.json();
        predictionResult = `
          <p>We predict it's <span class="${predictionData.prediction === 'spam' ? 'spam-text' : 'not-spam-text'}">
            ${predictionData.prediction === 'spam' ? 'a spam message.' : 'not a spam message.'}
          </span></p>
          <p>Model Confidence: ${Math.round(predictionData.confidence * 100)}%</p>
        `;
      } catch (error) {
        console.error('Error testing link with /makePrediction:', error);
        predictionResult = '<p style="color: red;">Error: Unable to test the message for spam.</p>';
      }

      try {
        // Check if the input contains a URL
        const urlRegex = /\bhttps?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?/gi;
        const detectedUrl = link.match(urlRegex);

        if (!detectedUrl) {
          urlResult = '<p>URL: <span class="not-spam-text">No URL found</span></p>';
        } else {
          // Call the /verifyURLUpgraded endpoint
          const urlResponse = await fetch('http://127.0.0.1:5000/verifyURLUpgraded', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: detectedUrl[0] }),
          });
          const urlData = await urlResponse.json();
          const riskScore = urlData.risk_score || 'N/A';
          const urlSafety = riskScore < 75 ? 'Safe' : 'Not Safe';
          urlResult = `
            <p>URL: <span class="${urlSafety === 'Safe' ? 'not-spam-text' : 'spam-text'}">${urlSafety}</span></p>
            <p>Risk Score of URL: ${riskScore}</p>
          `;
        }
      } catch (error) {
        console.error('Error testing link with /verifyURLUpgraded:', error);
        urlResult = '<p style="color: red;">Error: Unable to evaluate the URL.</p>';
      }

      // Display both results
      resultDisplay.innerHTML = `
        <p>Glad you checked.</p>
        ${predictionResult}
        ${urlResult}
      `;
      resultDisplay.style.display = 'block'; // Show results
    } else {
      alert('Please select or enter a link.');
    }
  });
});
