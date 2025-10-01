
export default function Statistics({ stats }:{ stats: { name: string, stat: string }[] }) {
    return (
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
                Hello admin, welcome to dashboard.
            </h3>
            <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6"
                    >
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            {item.name}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {item.stat}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
