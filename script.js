// Wait for the HTML document to be fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the necessary elements from the DOM.
    const form = document.getElementById('fuel-cost-form');
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');

    /**
     * Handles the form submission event.
     * @param {Event} event - The form submission event.
     */
    function calculateCost(event) {
        // Prevent the default form submission behavior, which reloads the page.
        event.preventDefault();

        // Get the values from the input fields.
        // The '+' operator is a shorthand to convert string values to numbers.
        const distance = +document.getElementById('distance').value;
        const price = +document.getElementById('price').value;
        const consumption = +document.getElementById('consumption').value;

        // --- Validation ---
        // Check if any of the inputs are not a number (NaN) or are zero or less.
        // This is important for preventing calculation errors.
        if (isNaN(distance) || isNaN(price) || isNaN(consumption) || distance <= 0 || price <= 0 || consumption <= 0) {
            // Simple feedback to the user if input is invalid.
            // Using a more user-friendly modal or message would be an improvement.
            alert('Vänligen fyll i alla fält med positiva siffror.');
            return; // Stop the function execution.
        }

        // --- Calculation ---
        // The core logic of the calculator.
        const totalCost = (distance * consumption) * price;

        // --- Displaying the Result ---
        // Format the number to two decimal places for currency representation.
        // .toLocaleString('sv-SE', ...) ensures the formatting is correct for Swedish standards (e.g., using comma as decimal separator).
        const formattedCost = totalCost.toLocaleString('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Update the result text content.
        resultText.textContent = formattedCost;

        // Make the result box visible by changing its class.
        // This triggers the CSS transitions for a smooth animation.
        if (resultBox.classList.contains('result-box-hidden')) {
            resultBox.classList.remove('result-box-hidden');
            resultBox.classList.add('result-box-visible');
        }
    }

    // Attach the calculateCost function to the form's 'submit' event.
    form.addEventListener('submit', calculateCost);
});
