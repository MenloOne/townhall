class MessageBoardGraph {
  constructor() {
    this.nodes = {}
  }

  children(nodeID) {
    return this.nodes[nodeID]
  }

  addNode(nodeID, parentID) {
    if(!this.nodes[nodeID]) { this.nodes[nodeID] = [] }

    if(parentID) {
      this.addNode(parentID)
      this.nodes[parentID].push(nodeID)
    }
  }
}

export default MessageBoardGraph
