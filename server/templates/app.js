// module.exports = (info, countdown, related, reviews) => `
// <div id="Info">${info}</div>
// <div id="CountDown">${countdown}</div>
// <div id="Related">${related}</div>
// <div id="Reviews">${reviews}</div>
// `;
module.exports = (components) => `
<div><div id="Sidebar">${components.Sidebar.string}</div></div>
`;
