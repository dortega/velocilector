export default function GameTable({ games, columns, emptyMessage }) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage || "No hay juegos registrados"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="text-sm">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={game.id || index}>
              {columns.map((column) => (
                <td key={`${game.id || index}-${column.key}`}>
                  {column.render ? column.render(game) : game[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 