package org.example;

import java.util.Arrays;
import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;



@DataType()
public final class Document {

    @Property()
    private final String documentID;

    @Property()
    private final String creatorID;

    @Property()
    private String documentName;

    @Property()
    private String documentHash;

    @Property()
    private final String documentType;

    @Property()
    private boolean  signable;

    @Property()
    private String lastInteractedWithID;

    @Property()
    private DocumentAction lastAction;

    @Property()
    private double[] vector;

    public String getDocumentID(){
        return documentID;
    }

    public String getCreatorID() {
        return creatorID;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentHash() {
        return documentHash;
    }

    public String getDocumentType(){
        return documentType;
    }

    public boolean getSignable(){
        return signable;
    }

    public void setSignable(boolean signable){
        this.signable = signable;
    }

    public void setHash(String hash){
        this.documentHash = hash;
    }
    
    public void setName(String newName){
        this.documentName = newName;
    }

    public String getLastAction() {
        return lastAction.toString();
    }

    public void setLastAction(DocumentAction lastAction) {
        this.lastAction = lastAction;
    }

    public String getLastInteractedWithID() {
        return lastInteractedWithID;
    }

    public void setLastInteractedWithID(String lastInteractedWithID) {
        this.lastInteractedWithID = lastInteractedWithID;
    }
    

    /*
    Constructor
    document id is the name and this should be checked for uniqueness before document creation
    */
    public Document(@JsonProperty("documentID") final String documentID, @JsonProperty("creatorID") final String creatorID, 
                    @JsonProperty("documentName") final String documentName,@JsonProperty("documentHash") final String documentHash,
                    @JsonProperty("documentType") final String documentType,@JsonProperty("signable") final boolean signable,@JsonProperty("vector") final double[] vector){
        
        this.documentID = documentID;
        this.creatorID = creatorID;
        this.documentName = documentName;
        this.documentHash = documentHash;
        this.documentType = documentType;
        this.signable = signable;
        this.lastAction=DocumentAction.CREATED;
        this.lastInteractedWithID = creatorID;
        this.vector = vector;

    }

    @Override
    public boolean equals(final Object obj) {
        if(this == obj){
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Document other = (Document) obj;

        return Objects.deepEquals(
            new String[]{getDocumentID(), getCreatorID(), getDocumentName(), getDocumentHash(), getDocumentType(),String.valueOf(getSignable()),this.lastAction.toString(),this.lastInteractedWithID,Arrays.toString(this.getVector())},
            new String[]{other.getDocumentID(),other.getCreatorID(), other.getDocumentName(), other.getDocumentHash(), other.getDocumentType(),String.valueOf(other.getSignable()),other.lastAction.toString(),other.lastInteractedWithID,Arrays.toString(other.getVector())}
    );
        
        
    }

    @Override
    public int hashCode() {
        
        return Objects.hash(getDocumentID(),getCreatorID(), getDocumentName(), getDocumentHash(), getDocumentType(),String.valueOf(getSignable()),getLastAction(),getLastInteractedWithID(),this.getVector());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode()) +"documentID=" + getDocumentID() + "creatorID=" + getCreatorID() + ", documentName=" + getDocumentName() 
                + ", documentHash=" + getDocumentHash() + ", documentType=" + getDocumentType() + "signable=" + String.valueOf(getSignable()) + 
                "Last Action" + getLastAction() + "LastInteractedID" + getLastInteractedWithID()  + "Vector" + Arrays.toString(this.getVector()) + "]";
    }

    public double[] getVector() {
        return vector;
    }

    public void setVector(double [] newVector){
        this.vector = newVector;
        
    }



    


}