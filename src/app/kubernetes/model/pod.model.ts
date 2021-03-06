import {KubernetesSpecResource} from "./kuberentesspecresource.model";

export class Pod extends KubernetesSpecResource {
  public images: Array<String>;
  public phase: String;

  public setResource(resource) {
    var answer = super.setResource(resource);
    this.images = new Array<String>();
    let spec = this.spec;
    if (spec) {
      let containers = spec.containers;
      if (containers) {
        containers.forEach((c) => {
          let image = c.image;
          if (image) {
            this.images.push(image);
          }
        });
      }
    }
    let metadata = resource.metadata || {};
    if (metadata.deletionTimestamp) {
      this.phase = "Terminating";
      console.log("========== Terminating pod! " + this.name);
    } else {
      let status = this.status;
      if (status) {
        this.phase = status.phase;
        let containerStatuses = status.containerStatuses;
        if (containerStatuses && containerStatuses.length) {
          let ready = true;
          for (let cs of containerStatuses) {
            if (!cs.ready) {
              ready = false;
              break;
            }
          }
          if (ready) {
            this.phase = "Ready";
          }
        }
      }
    }
    return answer;
  }

  defaultKind() {
    return 'Pod';
  }
}

export class Pods extends Array<Pod> {
}
