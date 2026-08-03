// ============================================================
// FUTURECOLLEGE — Admission Enquiry Form
// ES6 Version - Part 1
// ============================================================

(() => {

  'use strict';

  // ============================================================
  // FORM ELEMENTS
  // ============================================================

  const form = document.querySelector("#enquiryForm");

  if (!form) return;

  const submitBtn = document.querySelector("#enquirySubmitBtn");
  const formCard = document.querySelector("#enquiryFormCard");

  // ============================================================
  // INPUT FIELDS
  // ============================================================

  const nameField = document.querySelector("#enquiryNameField");
  const nameInput = document.querySelector("#enquiryName");

  const emailField = document.querySelector("#enquiryEmailField");
  const emailInput = document.querySelector("#enquiryEmail");

  const phoneField = document.querySelector("#enquiryPhoneField");
  const phoneInput = document.querySelector("#enquiryPhone");

  let iti = null;

  // ============================================================
  // COURSE DATA
  // ============================================================

  const COURSE_GROUPS = [
    {
      group: "Engineering & Technology",
      items: [
        "Engineering",
        "B.Tech",
        "M.Tech",
        "Polytechnic",
        "ITI",
        "Diploma"
      ]
    },
    {
      group: "Computer & IT",
      items: [
        "Computer Science",
        "BCA",
        "MCA",
        "Data Science",
        "Artificial Intelligence",
        "Cyber Security",
        "Digital Marketing"
      ]
    },
    {
      group: "Medical & Health Sciences",
      items: [
        "Medical",
        "Nursing",
        "Pharmacy",
        "Paramedical"
      ]
    },
    {
      group: "Management & Business",
      items: [
        "MBA",
        "BBA",
        "Management",
        "Aviation"
      ]
    },
    {
      group: "Design & Architecture",
      items: [
        "Architecture",
        "Design",
        "Interior Design",
        "Fashion Design"
      ]
    },
    {
      group: "Arts & Media",
      items: [
        "Arts",
        "Animation",
        "Mass Communication"
      ]
    },
    {
      group: "Science, Commerce & Law",
      items: [
        "Science",
        "Commerce",
        "Law",
        "Agriculture",
        "Education"
      ]
    },
    {
      group: "Hospitality",
      items: [
        "Hotel Management"
      ]
    },
    {
      group: "Other",
      items: [
        "Other"
      ]
    }
  ];

  // ============================================================
  // COMMON FUNCTIONS
  // ============================================================

  const setError = (field, message) => {

    field.classList.add("has-error");
    field.classList.remove("is-valid");

    const errorText = field.querySelector(".enquiry-error-msg span");

    if (errorText) {
      errorText.textContent = message;
    }

  };

  const setValid = (field) => {

    field.classList.remove("has-error");
    field.classList.add("is-valid");

  };

  const clearState = (field) => {

    field.classList.remove("has-error");
    field.classList.remove("is-valid");

  };
  // ============================================================
  // NAME VALIDATION
  // ============================================================

  const validateName = (showError = false) => {

    const value = nameInput.value.trim();
    const regex = /^[A-Za-z\s]{3,80}$/;

    if (!value) {

      if (showError) {
        setError(nameField, "Full Name is required.");
      } else {
        clearState(nameField);
      }

      return false;
    }

    if (!regex.test(value)) {

      if (showError) {
        setError(nameField, "Only alphabets and spaces allowed.");
      }

      return false;
    }

    setValid(nameField);

    return true;

  };

  nameInput.addEventListener("input", () => {

    validateName(nameInput.value.length > 0);

  });

  nameInput.addEventListener("blur", () => {

    validateName(true);

  });



  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  const validateEmail = (showError = false) => {

    const value = emailInput.value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!value) {

      if (showError) {
        setError(emailField, "Email Address is required.");
      } else {
        clearState(emailField);
      }

      return false;

    }

    if (!regex.test(value)) {

      if (showError) {
        setError(emailField, "Please enter a valid Email Address.");
      }

      return false;

    }

    setValid(emailField);

    return true;

  };

  emailInput.addEventListener("input", () => {

    validateEmail(emailInput.value.length > 3);

  });

  emailInput.addEventListener("blur", () => {

    validateEmail(true);

  });

  // ============================================================
  // INTERNATIONAL PHONE INPUT
  // ============================================================

  phoneInput.addEventListener("keypress", (e) => {

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }

  });

  phoneInput.addEventListener("input", () => {

    phoneInput.value = phoneInput.value.replace(/\D/g, "");

  });

  if (window.intlTelInput) {

    iti = window.intlTelInput(phoneInput, {

      initialCountry: "in",

      preferredCountries: [
        "in",
        "us",
        "gb",
        "ae",
        "au",
        "ca"
      ],

      separateDialCode: true,

      utilsScript: "../vendor/intl-tel-input/js/utils.js"

    });

  }

  const validatePhone = (showError = false) => {

    const value = phoneInput.value.trim();

    if (!value) {

      if (showError) {

        setError(
          phoneField,
          "Mobile Number is required."
        );

      } else {

        clearState(phoneField);

      }

      return false;

    }

    if (iti && typeof iti.isValidNumber === "function") {

      if (!iti.isValidNumber()) {

        if (showError) {

          setError(
            phoneField,
            "Please enter a valid Mobile Number."
          );

        }

        return false;

      }

    } else {

      if (value.length < 6 || value.length > 14) {

        if (showError) {

          setError(
            phoneField,
            "Please enter a valid Mobile Number."
          );

        }

        return false;

      }

    }

    setValid(phoneField);

    return true;

  };

  phoneInput.addEventListener("input", () => {

    validatePhone(phoneInput.value.length > 5);

  });

  phoneInput.addEventListener("blur", () => {

    validatePhone(true);

  });

  // ============================================================
  // SEARCHABLE COMBOBOX
  // ============================================================

  const createCombobox = ({
    wrapId,
    fieldId,
    inputId,
    hiddenId,
    panelId,
    groups,
    showState = false,
    requiredMessage
  }) => {

    const wrap = document.getElementById(wrapId);
    const field = document.getElementById(fieldId);
    const input = document.getElementById(inputId);
    const hidden = document.getElementById(hiddenId);
    const panel = document.getElementById(panelId);

    let activeIndex = -1;
    let flatOptions = [];

    const renderOptions = (query = "") => {

      panel.innerHTML = "";
      flatOptions = [];

      const keyword = query.trim().toLowerCase();

      let hasResult = false;

      groups.forEach(group => {

        const matches = group.items.filter(item => {

          return (
            keyword === "" ||
            item.toLowerCase().includes(keyword) ||
            group.group.toLowerCase().includes(keyword)
          );

        });

        if (!matches.length) return;

        hasResult = true;

        const heading = document.createElement("div");
        heading.className = "enquiry-combobox-group-label";
        heading.textContent = group.group;

        panel.appendChild(heading);

        matches.forEach(item => {

          const option = document.createElement("div");

          option.className = "enquiry-combobox-option";

          option.dataset.value = item;

          option.dataset.group = group.group;

          option.textContent = item;

          option.addEventListener("click", () => {

            selectOption(item, group.group);

          });

          panel.appendChild(option);

          flatOptions.push(option);

        });

      });

      if (!hasResult) {

        const empty = document.createElement("div");

        empty.className = "enquiry-combobox-empty";

        empty.textContent = "No matching result found.";

        panel.appendChild(empty);

      }

      activeIndex = -1;

    };

    const open = () => {

      wrap.classList.add("is-open");

      renderOptions(input.value);

    };

    const close = () => {

      wrap.classList.remove("is-open");

      activeIndex = -1;

    };

    const selectOption = (value, group) => {

      input.value = showState
        ? `${value}, ${group}`
        : value;

      hidden.value = value;

      close();

      validate(true);

    };

    const validate = (showError = false) => {

      if (!hidden.value) {

        if (showError) {

          setError(field, requiredMessage);

        } else {

          clearState(field);

        }

        return false;

      }

      setValid(field);

      return true;

    };

    const highlight = () => {

      flatOptions.forEach(option =>
        option.classList.remove("is-active")
      );

      const current = flatOptions[activeIndex];

      if (!current) return;

      current.classList.add("is-active");

      current.scrollIntoView({
        block: "nearest"
      });

    };

    input.addEventListener("focus", open);

    input.addEventListener("click", open);

    input.addEventListener("input", () => {

      hidden.value = "";

      clearState(field);

      renderOptions(input.value);

      open();

    });

    input.addEventListener("keydown", (e) => {

      switch (e.key) {

        case "ArrowDown":

          e.preventDefault();

          if (!wrap.classList.contains("is-open")) {

            open();

            return;

          }

          activeIndex = Math.min(
            activeIndex + 1,
            flatOptions.length - 1
          );

          highlight();

          break;

        case "ArrowUp":

          e.preventDefault();

          activeIndex = Math.max(
            activeIndex - 1,
            0
          );

          highlight();

          break;

        case "Enter":

          e.preventDefault();

          if (
            activeIndex >= 0 &&
            flatOptions[activeIndex]
          ) {

            flatOptions[activeIndex].click();

          }

          break;

        case "Escape":

          close();

          break;

      }

    });

    document.addEventListener("click", (e) => {

      if (!wrap.contains(e.target)) {

        close();

      }

    });

    input.addEventListener("blur", () => {

      setTimeout(() => {

        validate(true);

      }, 150);

    });

    return {

      validate,

      renderOptions

    };

  };

  // ============================================================
  // CITY COMBOBOX
  // ============================================================

  const cityGroups = (window.FC_INDIA_CITIES || []).map(city => ({

    group: city.state,

    items: city.cities

  }));

  const cityCombo = createCombobox({

    wrapId: "enquiryCityCombo",

    fieldId: "enquiryCityField",

    inputId: "enquiryCityInput",

    hiddenId: "enquiryCityValue",

    panelId: "enquiryCityPanel",

    groups: cityGroups,

    showState: true,

    requiredMessage: "Please select your city."

  });

  // ============================================================
  // COURSE COMBOBOX
  // ============================================================

  const courseCombo = createCombobox({

    wrapId: "enquiryCourseCombo",

    fieldId: "enquiryCourseField",

    inputId: "enquiryCourseInput",

    hiddenId: "enquiryCourseValue",

    panelId: "enquiryCoursePanel",

    groups: COURSE_GROUPS,

    showState: false,

    requiredMessage: "Please select a course."

  });

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const validName = validateName(true);
    const validEmail = validateEmail(true);
    const validPhone = validatePhone(true);
    const validCity = cityCombo.validate(true);
    const validCourse = courseCombo.validate(true);

    if (!(validName && validEmail && validPhone && validCity && validCourse)) {

      const firstError = form.querySelector(".has-error");

      if (firstError) {

        firstError.scrollIntoView({

          behavior: "smooth",

          block: "center"

        });

      }

      return;

    }

    submitBtn.disabled = true;

    submitBtn.classList.add("is-loading");

    try {

      const formData = new FormData(form);

      if (iti) {

        formData.set("mobile_number", iti.getNumber());

      }

      const response = await fetch("../contact-submit.php", {

        method: "POST",

        body: formData

      });

      const result = await response.json();

      submitBtn.disabled = false;

      submitBtn.classList.remove("is-loading");

      if (result.status) {

        formCard.classList.add("is-success");

        form.reset();

        if (iti) {

          iti.setNumber("");

        }

        clearState(nameField);
        clearState(emailField);
        clearState(phoneField);

        const cityField = document.getElementById("enquiryCityField");
        const courseField = document.getElementById("enquiryCourseField");
        const cityInput = document.getElementById("enquiryCityInput");
        const courseInput = document.getElementById("enquiryCourseInput");
        const cityVal = document.getElementById("enquiryCityValue");
        const courseVal = document.getElementById("enquiryCourseValue");

        if (cityField) clearState(cityField);
        if (courseField) clearState(courseField);
        if (cityInput) cityInput.value = "";
        if (courseInput) courseInput.value = "";
        if (cityVal) cityVal.value = "";
        if (courseVal) courseVal.value = "";

        // Form submit hone ke 2 second baad form ko wapis dikhane ke liye auto-refresh / hide success
        setTimeout(() => {
          formCard.classList.remove("is-success");
        }, 2000);

      } else {

        Swal.fire({

          icon: "error",

          title: "Failed",

          text: result.message

        });

      }

    } catch (error) {

      submitBtn.disabled = false;

      submitBtn.classList.remove("is-loading");

      Swal.fire({

        icon: "error",

        title: "Server Error",

        text: "Unable to submit enquiry. Please try again."

      });

      console.error(error);

    }

  });

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetBtn = document.querySelector("#enquiryResetBtn");

  if (resetBtn) {

    resetBtn.addEventListener("click", () => {

      formCard.classList.remove("is-success");

      nameInput.focus();

    });

  }

})();