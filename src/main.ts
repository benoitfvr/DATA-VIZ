import "./style.css";
import * as d3 from "d3";

d3.select("body").insert("h2", ":first-child").html("TOP de l'année choisie");

const size = d3
  .select("#top")
  .append("form")
  .attr("class", "choix")
  .append("fieldset");
size.append("legend").html("Choisir une taille");
size
  .selectAll("input")
  .data([3, 5, 10, 20])
  .enter()
  .append("label")
  .text((d) => d)
  .insert("input")
  .attr("type", "radio")
  .attr("name", "size")
  .attr("value", (d) => d)
  .property("checked", (d) => d);

const years = d3
  .select("#top")
  .append("form")
  .attr("class", "choix")
  .append("fieldset");
years.append("legend").html("Choisir une année");
years.append("select").attr("name", "annee").attr("id", "year_choice");

const flop = d3
  .select("#top")
  .append("form")
  .attr("class", "choix")
  .append("fieldset");
flop.append("legend").html("Choisir si vous souhaitez un FLOP");
flop
  .selectAll("input")
  .data([false])
  .enter()
  .append("label")
  .text("FLOP")
  .insert("input")
  .attr("type", "checkbox")
  .attr("name", "flop")
  .attr("value", (d) => d)
  .property("checked", (d) => d);

const regions = d3
  .select("#top")
  .append("form")
  .attr("class", "choix")
  .append("fieldset");
regions.append("legend").html("Choisir une région");
regions.append("select").attr("name", "region").attr("id", "region_choice");

d3.select("#top")
  .append("table")
  .append("thead")
  .append("tr")
  .selectAll("th")
  .data(["Pays", "Region", "Rang", "Documents", "Citations", "H-index"])
  .enter()
  .append("th")
  .html((d) => d);

d3.select("#top").select("table").append("tbody").attr("id", "table_top");

const generateCell = (d: any) =>
  `<td class='${isNaN(parseInt(d)) ? "texte" : "nombre"}'>${d}</td>`;

const generateRow = (d: any) =>
  generateCell(d.Country) +
  generateCell(d.Region) +
  generateCell(d.Rank) +
  generateCell(d.Documents) +
  generateCell(d.Citations) +
  generateCell(d.Hindex);

d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShuV7YDfFvbcOcpku7BKY0_sN6i3SaVbva9ebY9wzgOEHNS6rb8mX21eeRNnHGQj5ns64_EY2CpJtc/pub?gid=1902854758&single=true&output=csv",
  function (d) {
    return {
      Year: parseInt(d.Year),
      Rank: parseInt(d.Rank),
      Region: d.Region,
      Country: d.Country,
      Documents: parseInt(d.Documents),
      Citations: parseInt(d.Citations),
      Hindex: parseInt(d["H index"]),
    };
  }
).then((data) => {
  type Data = {
    Year: number;
    Rank: number;
    Region: string;
    Country: string;
    Documents: number;
    Citations: number;
    Hindex: number;
  };

  const filterData = (data: d3.DSVParsedArray<Data>) => {
    const year = parseInt(
      (d3.select("#year_choice").node() as HTMLSelectElement)?.value
    );
    const region = (d3.select("#region_choice").node() as HTMLSelectElement)
      ?.value;
    const size = parseInt(
      (d3.select('input[name="size"]:checked').node() as HTMLInputElement)
        ?.value
    );

    const yearSort = (d: Data) => d.Year == year || isNaN(year);
    const regionSort = (d: Data) =>
      d.Region == region || region == "Select a specific region";
    const sizeSort = (d: Data) => d.Rank <= size;

    return d3.filter(data, (d) => yearSort(d) && regionSort(d) && sizeSort(d));
  };

  const generateTable = (data: d3.DSVParsedArray<Data>) => {
    const reversed = (
      d3.select('input[name="flop"]:checked').node() as HTMLInputElement
    )?.checked;
    const filteredData = filterData(data);
    const tableData = reversed ? filteredData.reverse() : filteredData;

    const sizeInput = d3
      .select('input[name="size"]:checked')
      .node() as HTMLInputElement;
    const sizeValue = parseInt(sizeInput.value);

    d3.select("#table_top")
      .html("")
      .selectAll("tr")
      .data(tableData)
      .enter()
      .append("tr")
      .style("visibility", (_d, i) => {
        return i + 1 > sizeValue ? "hidden" : "visible";
      })
      .html(generateRow);
  };

  const setSettings = (
    data: d3.DSVParsedArray<Data>,
    key: "Year" | "Region",
    defaultValue?: boolean
  ) => {
    return defaultValue
      ? Array.from([
          "Select a specific region",
          ...new Set(data.map((d) => d[key])),
        ])
      : Array.from(new Set(data.map((d) => d[key])));
  };

  d3.select("#region_choice")
    .selectAll("option")
    .data(setSettings(data, "Region", true))
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .html((d) => String(d));

  d3.select("#year_choice")
    .selectAll("option")
    .data(setSettings(data, "Year"))
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .html((d) => String(d));

  size.on("change", () => {
    d3.select("#table_top")
      .selectAll("tr")
      .style("display", (_d, i) => {
        return i + 1 >
          parseInt(
            (d3.select('input[name="size"]:checked').node() as HTMLInputElement)
              ?.value
          )
          ? "none"
          : "table-row";
      });
  });

  flop.on("change", () => generateTable(data));
  years.on("change", () => generateTable(data));
  regions.on("change", () => generateTable(data));

  generateTable(data);
  generateScatterPlot(data);
});

function generateScatterPlot(data: any) {
  const lastYear = d3.max(data, (d: any) => d.Year);
  const lastYearData = data.filter((d: any) => d.Year === lastYear);

  const avgDocuments = d3.mean(lastYearData, (d: any) => d.Documents) as any;
  const avgCitations = d3.mean(lastYearData, (d: any) => d.Citations) as any;

  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = "100%",
    height = 600;

  const color = d3
    .scaleSequential()
    .domain([1, lastYearData.length])
    .interpolator(d3.interpolateRgb("red", "green"));

  const svg = d3
    .select("#top")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLog()
    .domain([1, d3.max(lastYearData, (d: any) => d.Documents)] as any)
    .range([0, width] as any);

  const y = d3
    .scaleLog()
    .domain([1, d3.max(lastYearData, (d: any) => d.Citations)] as any)
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  const size = d3
    .scaleLinear()
    .domain([
      d3.min(lastYearData, (d: any) => d.Hindex),
      d3.max(lastYearData, (d: any) => d.Hindex),
    ] as any)
    .range([5, 20]);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("dot")
    .data(lastYearData)
    .enter()
    .append("circle")
    .attr("cx", (d: any) => x(d.Documents))
    .attr("cy", (d: any) => y(d.Citations))
    .attr("r", (d: any) => size(d.Hindex))
    .style("fill", (d: any) => color(d.Rank))
    .style("opacity", 0.7)
    .on("mouseover", (event, d: any) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.Country)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  svg
    .append("line")
    .attr("x1", x(avgDocuments))
    .attr("y1", 0)
    .attr("x2", x(avgDocuments))
    .attr("y2", height)
    .attr("stroke", "grey")
    .style("stroke-dasharray", "3,3");

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", y(avgCitations))
    .attr("x2", width)
    .attr("y2", y(avgCitations))
    .attr("stroke", "grey")
    .style("stroke-dasharray", "3,3");
}
