function Report() {
  return {
    Trash: {
      synced: 0,
      unsynced: 0,
    },
    Catch: {
      synced: 0,
      unsynced: 0,
    },
    countItem: function (item) {
      try {
        this[item.type][item.synced ? 'synced' : 'unsynced'] += 1;
      } catch (e) {
        console.log(e);
      }
    },
  };
}

export default Report;
