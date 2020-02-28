document.addEventListener('DOMContentLoaded', function() {
  fetchData();
  async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    const container = document.querySelector('#dataList');
    data.forEach((el, index) => {
      const date = new Date(el.time * 1000).toLocaleDateString();
      const row = `${index + 1}. ${el.timezone}, ${el.temperature}, ${
        el.latitude
      }, ${el.longitude}, ${date}, ${el.aq}`;
      const p = document.createElement('P');
      p.textContent = row;
      container.append(p);
    });
  }
});
