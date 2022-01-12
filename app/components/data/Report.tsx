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
    total: 0,
    countItem: function (item) {
      try {
        const count = item.quantity || 1;
        this.total += count;
        this[item.type][item.synced ? 'synced' : 'unsynced'] += count;
      } catch (e) {
        // TODO Monitoring!
        console.log(e);
      }
    },
  };
}

export default Report;
