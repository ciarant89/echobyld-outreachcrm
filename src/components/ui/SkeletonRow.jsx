export default function SkeletonRow({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '12px 14px' }}>
          <div
            className="skeleton"
            style={{ height: 14, width: i === 0 ? 140 : 80, borderRadius: 4 }}
          />
        </td>
      ))}
    </tr>
  )
}
