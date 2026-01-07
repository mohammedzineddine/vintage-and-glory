/**
 * YouCan Wilaya Plugin
 * Adds a dropdown for selecting Algerian wilayas to the YouCan checkout form
 * 
 * @version 1.0.0
 * @author Claude
 */

(function () {
  // Algerian wilayas data
  const wilayasData = [
    { "code": "01", "name": "Adrar", "arabic_name": "أدرار" },
    { "code": "02", "name": "Chlef", "arabic_name": "الشلف" },
    { "code": "03", "name": "Laghouat", "arabic_name": "الأغواط" },
    { "code": "04", "name": "Oum El Bouaghi", "arabic_name": "أم البواقي" },
    { "code": "05", "name": "Batna", "arabic_name": "باتنة" },
    { "code": "06", "name": "Béjaïa", "arabic_name": "بجاية" },
    { "code": "07", "name": "Biskra", "arabic_name": "بسكرة" },
    { "code": "08", "name": "Béchar", "arabic_name": "بشار" },
    { "code": "09", "name": "Blida", "arabic_name": "البليدة" },
    { "code": "10", "name": "Bouïra", "arabic_name": "البويرة" },
    { "code": "11", "name": "Tamanrasset", "arabic_name": "تمنراست" },
    { "code": "12", "name": "Tébessa", "arabic_name": "تبسة" },
    { "code": "13", "name": "Tlemcen", "arabic_name": "تلمسان" },
    { "code": "14", "name": "Tiaret", "arabic_name": "تيارت" },
    { "code": "15", "name": "Tizi Ouzou", "arabic_name": "تيزي وزو" },
    { "code": "16", "name": "Algiers", "arabic_name": "الجزائر" },
    { "code": "17", "name": "Djelfa", "arabic_name": "الجلفة" },
    { "code": "18", "name": "Jijel", "arabic_name": "جيجل" },
    { "code": "19", "name": "Sétif", "arabic_name": "سطيف" },
    { "code": "20", "name": "Saïda", "arabic_name": "سعيدة" },
    { "code": "21", "name": "Skikda", "arabic_name": "سكيكدة" },
    { "code": "22", "name": "Sidi Bel Abbès", "arabic_name": "سيدي بلعباس" },
    { "code": "23", "name": "Annaba", "arabic_name": "عنابة" },
    { "code": "24", "name": "Guelma", "arabic_name": "قالمة" },
    { "code": "25", "name": "Constantine", "arabic_name": "قسنطينة" },
    { "code": "26", "name": "Médéa", "arabic_name": "المدية" },
    { "code": "27", "name": "Mostaganem", "arabic_name": "مستغانم" },
    { "code": "28", "name": "M'Sila", "arabic_name": "المسيلة" },
    { "code": "29", "name": "Mascara", "arabic_name": "معسكر" },
    { "code": "30", "name": "Ouargla", "arabic_name": "ورقلة" },
    { "code": "31", "name": "Oran", "arabic_name": "وهران" },
    { "code": "32", "name": "El Bayadh", "arabic_name": "البيض" },
    { "code": "33", "name": "Illizi", "arabic_name": "اليزي" },
    { "code": "34", "name": "Bordj Bou Arréridj", "arabic_name": "برج بوعريريج" },
    { "code": "35", "name": "Boumerdès", "arabic_name": "بومرداس" },
    { "code": "36", "name": "El Tarf", "arabic_name": "الطارف" },
    { "code": "37", "name": "Tindouf", "arabic_name": "تندوف" },
    { "code": "38", "name": "Tissemsilt", "arabic_name": "تسمسيلت" },
    { "code": "39", "name": "El Oued", "arabic_name": "الوادي" },
    { "code": "40", "name": "Khenchela", "arabic_name": "خنشلة" },
    { "code": "41", "name": "Souk Ahras", "arabic_name": "سوق أهراس" },
    { "code": "42", "name": "Tipaza", "arabic_name": "تيبازة" },
    { "code": "43", "name": "Mila", "arabic_name": "ميلة" },
    { "code": "44", "name": "Aïn Defla", "arabic_name": "عين الدفلى" },
    { "code": "45", "name": "Naâma", "arabic_name": "النعامة" },
    { "code": "46", "name": "Aïn Témouchent", "arabic_name": "عين تموشنت" },
    { "code": "47", "name": "Ghardaïa", "arabic_name": "غرداية" },
    { "code": "48", "name": "Relizane", "arabic_name": "غليزان" },
    { "code": "49", "name": "Timimoun", "arabic_name": "تيميمون" },
    { "code": "50", "name": "Bordj Badji Mokhtar", "arabic_name": "برج باجي مختار" },
    { "code": "51", "name": "Ouled Djellal", "arabic_name": "أولاد جلال" },
    { "code": "52", "name": "Béni Abbès", "arabic_name": "بني عباس" },
    { "code": "53", "name": "Ain Salah", "arabic_name": "عين صالح" },
    { "code": "54", "name": "Ain Guezzam", "arabic_name": "عين قزّام" },
    { "code": "55", "name": "Touggourt", "arabic_name": "تقرت" },
    { "code": "56", "name": "Djanet", "arabic_name": "جانت" },
    { "code": "57", "name": "El M'Ghair", "arabic_name": "المغير" },
    { "code": "58", "name": "El Menia", "arabic_name": "المنيعة" }
  ];

  // Configuration
  const config = {
    formSelector: '#express-checkout-form, form[class*="checkout"], form.checkout-form', // Target form selector
    regionInputSelector: 'input[name="region"]', // Target the existing region input field
    fieldName: "region", // Use the existing region field
    requiredField: true, // Whether the field is required
  };

  // Initialize the plugin when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initWilayaDropdown);

  // Also try to initialize on page load in case DOMContentLoaded already fired
  window.addEventListener('load', function () {
    // Small delay to ensure all YouCan scripts have loaded
    setTimeout(initWilayaDropdown, 500);
  });

  // Function to initialize the wilaya dropdown
  function initWilayaDropdown() {
    // Find the target form
    const form = document.querySelector(config.formSelector);

    // If form doesn't exist, try again later or with different selectors
    if (!form) {
      console.log('YouCan Wilaya Plugin: Form not found. Retrying in 1 second...');
      setTimeout(function () {
        const alternativeSelectors = [
          '#express-checkout-form',
          'form.checkout-form',
          'form.checkout',
          'form[action*="checkout"]',
          'form[class*="checkout"]'
        ];

        for (const selector of alternativeSelectors) {
          const alternativeForm = document.querySelector(selector);
          if (alternativeForm) {
            convertRegionToWilayaDropdown(alternativeForm);
            return;
          }
        }

        console.error('YouCan Wilaya Plugin: Could not find a suitable form to inject the wilaya dropdown.');
      }, 1000);
      return;
    }

    // If form exists, convert the region field
    convertRegionToWilayaDropdown(form);
  }

  // Function to convert the region input to a wilaya dropdown
  function convertRegionToWilayaDropdown(form) {
    // Find the region input field
    const regionInput = form.querySelector(config.regionInputSelector);
    if (!regionInput) {
      console.error('YouCan Wilaya Plugin: Could not find the region input field.');
      return;
    }

    // Check if we've already converted this field
    if (regionInput.classList.contains('wilaya-converted')) {
      return;
    }

    // Get the parent form-group of the region field
    const regionFormGroup = regionInput.closest('.form-group') || regionInput.parentNode;
    if (!regionFormGroup) {
      console.error('YouCan Wilaya Plugin: Could not find the region form group.');
      return;
    }

    // Get the existing label if it exists
    const existingLabel = regionFormGroup.querySelector('label');

    // Create select element
    const select = document.createElement('select');
    select.className = 'wilaya-select';
    select.id = 'wilaya-select';
    select.name = config.fieldName;

    if (config.requiredField) {
      select.setAttribute('required', 'required');
    }

    // Add placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'اختر الولاية';
    placeholderOption.selected = true;
    placeholderOption.disabled = true;
    select.appendChild(placeholderOption);

    // Add wilaya options
    wilayasData.forEach(function (wilaya) {
      const option = document.createElement('option');
      option.value = wilaya.name;  // Use name as value
      option.textContent = wilaya.arabic_name + ' (' + wilaya.code + ')';
      option.setAttribute('data-code', wilaya.code);
      select.appendChild(option);
    });

    // Replace the input with the select
    regionInput.style.display = 'none';
    regionInput.classList.add('wilaya-converted');
    regionInput.parentNode.insertBefore(select, regionInput);

    // Update the label text if needed
    if (existingLabel) {
      existingLabel.textContent = 'الولاية';
    }

    // Sync the values between the select and the hidden input
    select.addEventListener('change', function () {
      regionInput.value = this.value;

      // Trigger change event on the original input to ensure validation works
      const event = new Event('change', { bubbles: true });
      regionInput.dispatchEvent(event);
    });

    // Inject CSS if it's not already injected
    injectCSS();

    console.log('YouCan Wilaya Plugin: Region input successfully converted to wilaya dropdown.');
  }

  // Function to inject CSS
  function injectCSS() {
    // Check if the CSS is already injected
    if (document.getElementById('wilaya-plugin-css')) {
      return;
    }

    // Create style element
    const style = document.createElement('style');
    style.id = 'wilaya-plugin-css';
    style.textContent = `
      .wilaya-select { 
        width: 100%; 
        max-width: 100%;
        padding: 10px; 
        border: 1px solid #ddd; 
        border-radius: 4px; 
        background-color: #fff; 
        font-size: 16px; 
        height: 46px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 12px;
        padding-right: 30px;
        text-overflow: ellipsis;
        direction: rtl;
        transition: all 0.2s ease;
      }
      .wilaya-select:focus { 
        outline: none; 
        border-color: #4a90e2; 
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2); 
      }
      .wilaya-select option { 
        font-size: inherit; 
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .wilaya-select { 
          font-size: 15px; 
          height: 44px; 
        }
      }
      @media (max-width: 480px) {
        .wilaya-select { 
          font-size: 14px; 
          height: 42px; 
          padding: 8px; 
          padding-right: 28px; 
          background-position: right 8px center; 
        }
      }
    `;

    document.head.appendChild(style);
  }
})(); 