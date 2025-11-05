## 🧠 Algorithms Visualizer

An interactive web application for exploring and visualizing algorithms across multiple categories — with real-time visual feedback, mathematical explanations, and code previews.

**🌐 Live Demo:** [https://mihnea-popescu.github.io/algorithms-visualizer/](https://mihnea-popescu.github.io/algorithms-visualizer/)

---

## 🧩 Overview

This project helps users **learn algorithms visually** — step by step, with interactive inputs, graph visualizations, and detailed explanations.
Each algorithm has its own page with:

- Interactive controls
- Mathematical explanations
- Step-by-step iteration visualization
- Real-time updates
- Python code previews

Built with **React**, **TypeScript**, **React Router**, and **react-force-graph-2d**.

---

## 🏠 Homepage

The homepage lists all major **algorithm categories**:

1. Graph Theory
2. Dynamic Programming
3. Greedy
4. Sorting

Each category links to its algorithms and well-known problems such as:

- Floyd–Warshall
- Dijkstra
- Traveling Salesman
- Knapsack
- Merge Sort

---

## 🦯 Navigation & Sitemap

- Uses **React Router** for routing.
- Every new algorithm page must also be added to **`public/sitemap.xml`** for SEO.

---

## 🧮 Example Algorithm Page Layout

Each algorithm visualization page includes:

1. **Header** — algorithm name and "Home" button
2. **Controls** — algorithm-specific inputs and iteration navigation
3. **Formula + Explanation** — current step’s math and logic
4. **Input Section** — user input area (matrix, array, etc.)
5. **Visualization** — visual representation using react-force-graph-2d or tables
6. **Python Code Preview** — short snippet of the algorithm
7. **Footer** — credit and GitHub link

---

### Example: Floyd–Warshall

#### Formula

```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

#### Explanation

Step k = 1 (A allowed as intermediate).
For each pair (i, j), check if going through vertex A yields a shorter path.
If so, update dist[i][j].

#### Visualization

Displays:

- Graph (using `react-force-graph-2d`)
- Distance matrix with highlighted updates
- Hoverable tooltips showing calculation details

---

## ⚙️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Routing:** React Router
- **Visualization:** react-force-graph-2d
- **Styling:** Tailwind CSS / custom CSS
- **Deployment:** GitHub Pages
- **Sitemap:** Static `public/sitemap.xml`

## 🧠 License

Open-source under the **MIT License**.
Contributions are welcome!
