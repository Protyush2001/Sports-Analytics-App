fetchData = async () => {
    try {
        const response = await fetch('https://api.cricapi.com/v1/cricScore?apikey=8f2ec94d-ea72-4796-b962-87697cb1c728');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};
fetchData();
