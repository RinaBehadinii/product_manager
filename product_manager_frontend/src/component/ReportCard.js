import React from 'react';

const ReportCard = ({report}) => {
    return (
        <div className="flex  flex-col gap-2 bg-white border border-gray-100 p-4 rounded shadow-md drop-shadow-md">
            <span className="text-xl font-semibold">{report.title}</span>
            <span className="text-gray-600">{report.description}</span>
            {report.data && (
                <div>
                    {report.data.map((item, index) => (
                        <span key={index} className="text-gray-800">
                            {item.label}: {item.value}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportCard;
