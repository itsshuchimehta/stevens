(function () {
  const inputBox = document.getElementById("Values");
  const ulResults = document.getElementById("results");
  ulResults.setAttribute("hidden", true);
  const ErrorP = document.getElementById("error-p");
  ErrorP.setAttribute("hidden", true);
  const staticForm = document.getElementById("static-form");
  let li_cls;
  if (staticForm) {
    const arrayValues = document.getElementById("Values");
    staticForm.addEventListener("submit", (event) => {
      ErrorP.setAttribute("hidden", true);
      event.preventDefault();

      try {
        const AllValues = arrayValues.value.trim();

        if (AllValues.trim().length > 0) {
          let CheckArr = AllValues.split(", ");
          CheckArr.forEach((array) => {
            if (array.length == 0) {
              throw "Please Input a variable number of arrays, separated by commas";
            }
          });
          let Arr = [];
          let Final_Arr = [];
          Arr = AllValues.split(",");

          Arr.forEach((a) => {
            if (a.trim() == "[]") {
              throw "Each array should have at least one element that is a whole number";
            }
            a = a.replace("[", "");
            a = a.replace("]", "");
            a = a.trim();
            if (a != "") {
              let val = Number(a);
              if (Number.isInteger(val) == true) {
                Final_Arr.push(val);
              } else {
                throw "All array elements should be whole numbers i.e. negative, positive and 0 , but no decimals.";
              }
            }
          });

          Final_Arr.sort(function (a, b) {
            return a - b;
          });
          li_cls = li_cls == "is-green" ? "is-red" : "is-green";
          var li = document.createElement("li");
          li.appendChild(document.createTextNode("[" + Final_Arr + "]"));
          li.classList.add(li_cls);
          ulResults.appendChild(li);
          ulResults.removeAttribute("hidden");
        } else {
          throw "Please Enter Array Values";
        }

        staticForm.reset();
        inputBox.focus();
      } catch (e) {
        staticForm.reset();
        inputBox.focus();
        const message = typeof e === "string" ? e : e.message;
        ErrorP.textContent = e;
        ErrorP.removeAttribute("hidden");
      }
    });
  }
})();
