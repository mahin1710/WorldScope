document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');

    // Clear previous results
    resultsContainer.innerHTML = '';
    if (!query) {
        alert('Please enter a country name');
        return;
    }

    // Show loader
    loader.classList.remove('d-none');

    try {
        // Fetch country data
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        if (!countryResponse.ok) {
            throw new Error('Country not found');
        }
        const countryData = await countryResponse.json();

        for (const country of countryData) {
            // Fetch weather data
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current_weather=true`
            );
            const weatherData = await weatherResponse.json();

            // Create country card
            const card = document.createElement('div');
            card.className = 'col-md-4 d-flex justify-content-center';

            card.innerHTML = `
                <div class="card">
                    <img src="${country.flags.png}" class="card-img-top" alt="Flag of ${country.name.common}">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text"><strong>Region:</strong> ${country.region}</p>
                        <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                        <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                        <button class="btn btn-secondary" onclick="showDetailsModal('${country.name.common}', '${country.population}', '${country.capital}', '${country.region}', '${weatherData.current_weather.temperature}', '${country.flags.png}', '${country.subregion}', '${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}', '${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}')">
                            More Details
                        </button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        }
    } catch (error) {
        alert(error.message);
    } finally {
        // Hide loader
        loader.classList.add('d-none');
    }
});

// Function to show detailed modal
function showDetailsModal(name, population, capital, region, weather, flag, subregion, languages, currency) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Set modal content
    modalTitle.innerText = name;
    modalBody.innerHTML = `
        <img src="${flag}" alt="Flag of ${name}" class="img-fluid mb-3">
        <p><strong>Population:</strong> ${parseInt(population).toLocaleString()}</p>
        <p><strong>Capital:</strong> ${capital || 'N/A'}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Subregion:</strong> ${subregion || 'N/A'}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Current Weather:</strong> ${weather}&deg;C</p>
    `;

    // Show modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}
