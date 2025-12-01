document.getElementById("entryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    disease: document.getElementById("disease").value,
    visit_date: document.getElementById("visit_date").value,
  };

  await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  alert("Saved");
  e.target.reset();
});

function exportData() {
  window.location.href = "/export";
}
