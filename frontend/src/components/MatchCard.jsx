const MatchCard = ({ match }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 w-full">
      <h2 className="text-lg font-semibold mb-1">{match.name}</h2>
      <p className="text-sm text-gray-600 mb-1">{match.date}</p>
      <p className="text-sm">{match.status}</p>
    </div>
  );
};

export default MatchCard;

