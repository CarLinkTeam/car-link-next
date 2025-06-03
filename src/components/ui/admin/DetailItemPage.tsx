export const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800">{value}</span>
    </div>
);
