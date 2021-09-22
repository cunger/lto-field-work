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
    countItem: (category, isSynced) => {
      this[category][isSynced ? 'synced' : 'unsynced'] += 1;
    }
  };
}

export default Report;
