document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const form = document.getElementById('calculator-form');
    const distanceInput = document.getElementById('distance');
    const fuelTypeSelect = document.getElementById('fuel-type');
    const fuelPriceInput = document.getElementById('fuel-price');
    const consumptionInput = document.getElementById('consumption');
    const peopleInput = document.getElementById('people');
    const roundTripCheckbox = document.getElementById('round-trip');
    const driverShareSlider = document.getElementById('driver-share');
    const driverShareInput = document.getElementById('driver-share-input');
    
    const advancedToggleBtn = document.getElementById('advanced-toggle-btn');
    const advancedSection = document.getElementById('advanced-section');
    
    const saveConsumptionBtn = document.getElementById('save-consumption-btn');
    const savedValueDisplay = document.getElementById('saved-value-display');

    const resultsSection = document.getElementById('results-section');
    const totalCostEl = document.getElementById('total-cost');
    const costPerPassengerEl = document.getElementById('cost-per-passenger');
    const costForDriverEl = document.getElementById('cost-for-driver');

    // --- INITIALIZATION ---
    loadSavedConsumption();
    updateFuelPrice();
    // Simulate distance calculation for demo purposes
    setupDistanceSimulation();

    // --- EVENT LISTENERS ---
    form.addEventListener('input', calculateAndDisplay);
    
    // Sync slider and number input for driver's share
    driverShareSlider.addEventListener('input', () => driverShareInput.value = driverShareSlider.value);
    driverShareInput.addEventListener('input', () => driverShareSlider.value = driverShareInput.value);

    // Toggle advanced section
    advancedToggleBtn.addEventListener('click', () => {
        advancedSection.classList.toggle('open');
        advancedToggleBtn.classList.toggle('open');
    });

    // Update fuel price when type changes
    fuelTypeSelect.addEventListener('change', updateFuelPrice);

    // Save consumption to localStorage
    saveConsumptionBtn.addEventListener('click', saveConsumption);

    // --- CORE FUNCTIONS ---
    
    /**
     * Main function to trigger calculation and display results.
     */
    function calculateAndDisplay() {
        const distance = parseFloat(distanceInput.value) || 0;
        const price = parseFloat(fuelPriceInput.value) || 0;
        const consumption = parseFloat(consumptionInput.value) || 0;
        const people = parseInt(peopleInput.value) || 1;
        const isRoundTrip = roundTripCheckbox.checked;
        const driverSharePercent = parseInt(driverShareInput.value) || 100;

        if (distance <= 0 || price <= 0 || consumption <= 0) {
            resultsSection.classList.remove('visible');
            return;
        }

        const finalDistance = isRoundTrip ? distance * 2 : distance;

        // Total Cost Calculation
        const totalFuel = (finalDistance / 100) * consumption;
        const totalCost = totalFuel * price;

        // Cost Splitting Calculation
        const driverFactor = driverSharePercent / 100;
        let costPerPassenger = 0;
        let costForDriver = 0;

        if (people <= 1) {
            costForDriver = totalCost;
            costPerPassenger = 0;
        } else {
            const numPassengers = people - 1;
            const totalShares = numPassengers + driverFactor;
            const costPerShare = totalCost / totalShares;
            
            costPerPassenger = costPerShare;
            costForDriver = costPerShare * driverFactor;
        }

        // Display results
        totalCostEl.textContent = formatCurrency(totalCost);
        costPerPassengerEl.textContent = formatCurrency(costPerPassenger);
        costForDriverEl.textContent = formatCurrency(costForDriver);
        resultsSection.classList.add('visible');
    }

    /**
     * Updates the fuel price input based on the selected fuel type.
     */
    function updateFuelPrice() {
        fuelPriceInput.value = fuelTypeSelect.value;
    }

    /**
     * Loads saved fuel consumption from localStorage.
     */
    function loadSavedConsumption() {
        const savedConsumption = localStorage.getItem('fuelConsumption');
        if (savedConsumption) {
            consumptionInput.value = savedConsumption;
            showSavedValue(savedConsumption);
        }
    }
    
    /**
     * Saves the current fuel consumption to localStorage.
     */
    function saveConsumption() {
        const consumption = consumptionInput.value;
        if (consumption && parseFloat(consumption) > 0) {
            localStorage.setItem('fuelConsumption', consumption);
            showSavedValue(consumption);
        } else {
            alert('Ange en giltig förbrukning för att spara.');
        }
    }

    /**
     * Displays the saved value and a delete button.
     */
    function showSavedValue(value) {
        savedValueDisplay.innerHTML = `
            <span>Sparat: <strong>${value} l/100km</strong></span>
            <button type="button" class="delete-btn" id="delete-saved-btn">×</button>
        `;
        document.getElementById('delete-saved-btn').addEventListener('click', deleteSavedConsumption);
    }
    
    /**
     * Deletes the saved consumption value.
     */
    function deleteSavedConsumption() {
        localStorage.removeItem('fuelConsumption');
        savedValueDisplay.innerHTML = '';
    }
    
    /**
     * Formats a number into Swedish currency format.
     */
    function formatCurrency(value) {
        return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
    }
    
    /**
     * SIMULATES distance calculation based on start/end location text.
     * In a real application, this would be an API call.
     */
    function setupDistanceSimulation() {
        const startInput = document.getElementById('start-location');
        const endInput = document.getElementById('end-location');
        
        function simulate() {
            const startLen = startInput.value.length;
            const endLen = endInput.value.length;
            if (startLen > 2 && endLen > 2) {
                // Pseudo-random distance based on text length for demo
                const simulatedDist = (startLen * 37 + endLen * 53) % 450 + 50;
                distanceInput.value = simulatedDist.toFixed(2);
                calculateAndDisplay();
            } else {
                distanceInput.value = '';
            }
        }
        
        startInput.addEventListener('input', simulate);
        endInput.addEventListener('input', simulate);
    }
});
