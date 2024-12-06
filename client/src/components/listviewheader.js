
export default function ListViewHeader({ title, onSortSelect }) {

  /*
    Just makes title and sort buttons for postlistpage.js
  */

  return (
    <ul className="box">
      <h2>{title}</h2>
      <ul className="sort-box">
        <button className="sort-btn" onClick={() => (onSortSelect('newest'))}>Newest</button>
        <button className="sort-btn" onClick={() => (onSortSelect('oldest'))}>Oldest</button>
        <button className="sort-btn" onClick={() => (onSortSelect('active'))}>Active</button>
      </ul>
    </ul>
  )
}