const wrapper = document.querySelector(".wrapper"),
      form = document.querySelector("form"),
      fileInput = form.querySelector("input"),
      infoText = form.querySelector("p"),
      closeBtn = document.querySelector(".close"),
      copyBtn = document.querySelector(".copy");

    function fetchQRCode(file, formData) {
        infoText.innerText = "Scanning QR Code...";

        fetch("http://api.qrserver.com/v1/read-qr-code/", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            const qrData = result[0]?.symbol[0]?.data;
            infoText.innerText = qrData ? "Upload QR Code to Scan" : "Couldn't scan QR Code";

            if (!qrData) return;

            document.querySelector("textarea").innerText = qrData;
            form.querySelector("img").src = URL.createObjectURL(file);
            wrapper.classList.add("active");
        })
        .catch(() => {
            infoText.innerText = "Couldn't scan QR Code";
        });
    }

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        fetchQRCode(file, formData);
    });

    copyBtn.addEventListener("click", () => {
        const qrText = document.querySelector("textarea").textContent;
        navigator.clipboard.writeText(qrText);
    });

    form.addEventListener("click", () => fileInput.click());

    closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));