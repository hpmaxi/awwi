import React from "react";
import { CompleteAddress } from "@aztec/circuits.js";

interface Props {
  accounts: CompleteAddress[];
  onSelect: (a: CompleteAddress) => void;
  selected: CompleteAddress | undefined;
}

export const AztecAccountsList: React.FC<Props> = ({
  accounts,
  onSelect,
  selected,
}) => {
  if (accounts.length === 0) {
    return <p className="text-gray-500 italic">No Aztec accounts found.</p>;
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Aztec Accounts</h2>
      <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {accounts.map((account) => {
          const isSelected =
            selected?.address.toString() === account.address.toString();
          return (
            <li
              key={account.address.toString()}
              className={`
                p-4 cursor-pointer transition-colors duration-150 ease-in-out
                ${
                  isSelected
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-50"
                }
              `}
              onClick={() => onSelect(account)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 w-3 h-3 rounded-full ${
                    isSelected ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {account.address.toString()}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
