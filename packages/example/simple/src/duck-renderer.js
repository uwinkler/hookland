import Reconciler from 'react-reconciler'

// Define the host configuration
const HostConfig = {
  // Create an instance of a host object (e.g., DOM node, canvas object)
  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    console.log(`Creating instance of type: ${type}`)
    return { type, props } // Custom logic for your environment
  },

  // Append a child to a parent instance
  appendChild(parentInstance, child) {
    console.log(`Appending child to parent`)
    parentInstance.children = parentInstance.children || []
    parentInstance.children.push(child)
  },

  resolveUpdatePriority(args) {
    console.log(`Resolving update priority`)  
  },

  // Remove a child from a parent instance
  removeChild(parentInstance, child) {
    console.log(`Removing child`)
    if (parentInstance.children) {
      parentInstance.children = parentInstance.children.filter(
        (c) => c !== child
      )
    }
  },

  // Finalize the initial setup for children
  finalizeInitialChildren(instance, type, props, rootContainerInstance) {
    return false // Return true if further updates are needed
  },

  // Other required methods (stubs for simplicity)
  prepareUpdate() {
    return true
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps) {},
  supportsMutation: false,
  supportsPersistence: true,
}

// Create the reconciler instance
const MyRenderer = Reconciler(HostConfig)

// Public API for rendering
export const RendererPublicAPI = {
  render(element, container) {
    const root = MyRenderer.createContainer(container, false, false) // Create a root container
    MyRenderer.updateContainer(element, root, null) // Schedule updates for rendering
  }
}





// RendererPublicAPI.render(App, {})
