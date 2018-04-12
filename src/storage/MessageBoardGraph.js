class MessageBoardGraph {
  constructor() {
    this.nodes = {}

    this.addNode('0x0');
  }

  children(nodeID) {
    return this.nodes[nodeID]
  }

  addNode(nodeID, parentID) {
    if(!this.nodes[nodeID]) { this.nodes[nodeID] = [] }

    if(parentID) {
      this.addNode(parentID)
      if(parentID !== nodeID && !this.nodes[parentID].includes(nodeID)) {
        this.nodes[parentID].push(nodeID)
      }
    }
  }
}

export default MessageBoardGraph
