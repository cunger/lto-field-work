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
    totalUnsynced: 0,
    countItem: function (item) {
      try {
        this.total += 1;
        if (item.synced) {
          this[item.type].synced += 1;
        } else {
          this[item.type].unsynced += 1;
          this.totalUnsynced += 1;
        }
        // this[item.type][item.synced ? 'synced' : 'unsynced'] += 1;
      } catch (e) {
        // TODO Monitoring!
        console.log(e);
      }
    },
  };
}

export default Report;
