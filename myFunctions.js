$(document.location).ready(function () {
    // 1. Show/Hide extra car details
    $(".carDetailsToggle").click(function () {
        $(this).next(".extraDetails").slideToggle(300);
    });

    // 2. Reveal booking form upon clicking continue
    $("#continueBtn").click(function () {
        var selectedCars = $("input[name='carSelect']:checked");
        if (selectedCars.length === 0) {
            alert("Please select at least one car before continuing.");
            return;
        }
        $("#bookingSection").fadeIn(400);
        $('html, body').animate({
            scrollTop: $("#bookingSection").offset().top - 100
        }, 500);
    });
});

// 3. Validation and Calculation Functions
function validateAndSubmitForm(e) {
    e.preventDefault();

    var fullName = document.getElementById("fullName").value.trim();
    var nationalId = document.getElementById("nationalId").value.trim();
    var startDateStr = document.getElementById("startDate").value;
    var endDateStr = document.getElementById("endDate").value;
    var mobileNumber = document.getElementById("mobileNumber").value.trim();
    var email = document.getElementById("email").value.trim();

    // Validate Full Name (Arabic letters and spaces only)
    if (fullName !== "") {
        var arabicRegex = /^[\u0600-\u06FF\s]+$/;
        if (!arabicRegex.test(fullName)) {
            alert("Error: Full name must consist of Arabic alphabetic letters only.");
            return false;
        }
    }

    // Validate National ID (11 digits, first two digits between 01 and 14) - Required
    var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    if (!nationalIdRegex.test(nationalId)) {
        alert("Error: National ID is required, must be exactly 11 digits, and start with a valid governorate code (01 to 14).");
        return false;
    }

    // Validate Dates - Required
    if (!startDateStr || !endDateStr) {
        alert("Error: Start and end rental dates are required.");
        return false;
    }

    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);

    if (endDate <= startDate) {
        alert("Error: Rental end date must be later than the start date.");
        return false;
    }

    // Validate Mobile Number (Syriatel / MTN networks)
    if (mobileNumber !== "") {
        var mobileRegex = /^09(3[0-9]|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9])\d{6}$/;
        if (!mobileRegex.test(mobileNumber)) {
            alert("Error: Mobile number must match Syrian mobile networks (Syriatel or MTN, e.g., 0933123456).");
            return false;
        }
    }

    // Validate Email
    if (email !== "") {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Error: Invalid email format.");
            return false;
        }
    }

    // Calculate rental days
    var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    var daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Calculate totals and discounts
    var totalAmount = 0;
    var carsListHtml = "<ul>";

    $("input[name='carSelect']:checked").each(function () {
        var title = $(this).data("title");
        var price = parseFloat($(this).data("price"));
        var itemTotal = price * daysCount;
        totalAmount += itemTotal;

        carsListHtml += "<li><strong>" + title + "</strong> - Daily Rate: " + price.toLocaleString() + " SYP</li>";
    });
    carsListHtml += "</ul>";

    // Apply 10% discount if rental period exceeds 7 days
    var discountAmount = 0;
    var discountText = "None (Duration is 7 days or less)";
    if (daysCount > 7) {
        discountAmount = totalAmount * 0.10;
        discountText = "10% (Rental duration exceeds 7 days)";
    }

    var finalAmount = totalAmount - discountAmount;

    // Populate modal dialog results
    var resultHtml = carsListHtml +
        "<br /><p><strong>Rental Duration:</strong> " + daysCount + " days</p>" +
        "<p><strong>Total Amount Before Discount:</strong> " + totalAmount.toLocaleString() + " SYP</p>" +
        "<p><strong>Applied Discount:</strong> " + discountText + " (-" + discountAmount.toLocaleString() + " SYP)</p>" +
        "<h3 style='color: #025595; margin-top: 10px;'>Final Payable Amount: " + finalAmount.toLocaleString() + " SYP</h3>";

    document.getElementById("modalDetails").innerHTML = resultHtml;
    document.getElementById("resultModal").style.display = "block";

    return false;
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}