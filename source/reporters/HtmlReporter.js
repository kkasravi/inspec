Inspec.HtmlReporter = Inspec.Reporter.extend({
  onStartTest : function(message){
    this.document = Inspec.root.document;
    var body = this.document.getElementsByTagName('body')[0];
    var viewport = this.document.createElement('div');
    viewport.id = "inspec";
    body.appendChild(viewport);
    this.viewport = viewport;
  },
  
  onEndTest : function(message){
  },
  
  onStartExampleGroup : function(message){
  },
  
  onEndExampleGroup : function(message){
  },
  
  onStartExample : function(message){
  },
  
  onEndExample : function(message){
    var example = message.example;
    var success = message.success;
    var error = message.error;
    var description = this.getDescription(example);
    
    var result = this.document.createElement('div');
    var title = this.document.createElement('div');
    title.className = "title";
    
    var text = this.document.createElement('div');
    text.className = "description";
    text.innerHTML = description;
    
    var clear = this.document.createElement('br');
    clear.setAttribute("clear", "both");


    var status = this.document.createElement('div');
    status.className = "status";

    if(success){
      result.className = "example success";
      title.appendChild(status);
      title.appendChild(text);
      title.appendChild(clear);
      result.appendChild(title);
    }
    else{
      if(error instanceof Inspec.ExpectationFailure){
        result.className = "example failure";
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
        var explanation = this.document.createElement('div');
        explanation.className = "explanation";
        explanation.innerHTML = error.toString();
        result.appendChild(explanation);
      } else if (error instanceof Inspec.ExamplePending){
        result.className = "example pending";
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
      } 
      else if(error instanceof Error){
        result.className = "example error";
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
        var explanation = this.document.createElement('div');
        explanation.className = "explanation";
        explanation.innerHTML = error.toString();
        result.appendChild(explanation);
      }
    }
    
    this.viewport.appendChild(result);
  },
  
  getExampleGroupDescription : function(exampleGroup){
    var parent = exampleGroup.getParent();
    var behavior = exampleGroup.getBehavior();
    
    var description = behavior ? behavior.getDescription() : "";
    
    if(parent)
      description = this.getExampleGroupDescription(parent) + " " + description;
    return description;
  },
  
  getDescription : function(example){
    var desc =  this.getExampleGroupDescription(example.exampleGroup)
      + " " + example.getDescription();
    return desc;
  }
});
