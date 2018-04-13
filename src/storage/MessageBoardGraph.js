/*
 * Copyright 2018 Vulcanize, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

    if(this.callback) { this.callback(); }
  }

  subscribeMessages(callback) {
    this.callback = callback;
  }
}

export default MessageBoardGraph
